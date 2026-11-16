// POST /api/stripe/webhook
//
// Stripe posts checkout.session.completed events here. We:
//   1. Read the RAW request body (bodyParser disabled — Stripe signs the
//      exact bytes Stripe sent us, so re-serialising parsed JSON would break
//      signature verification).
//   2. Verify the Stripe-Signature header against the raw body.
//   3. On `checkout.session.completed`, mark the matching booking `paid` and
//      send the caregiver a confirmation email via Resend.
//
// We always respond 200 to a verified webhook even if our downstream work
// errors — Stripe retries 4xx/5xx, and the booking can be repaired manually
// from the admin panel.

import { sbFetch, sbPatch } from "../_lib/supabase";
import { verifyWebhookSignature } from "../_lib/stripe";
import { sendBookingConfirmation, sendAdminBookingNotification } from "../_lib/email";

// Vercel: disable JSON body parser so we can verify the raw signed payload.
export const config = {
  api: {
    bodyParser: false,
  },
};

type IncomingMessage = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  on: (event: string, cb: (chunk: Buffer) => void) => void;
};

type ServerResponse = {
  status: (c: number) => ServerResponse;
  json: (b: unknown) => ServerResponse;
};

type BookingRow = {
  id: string;
  caregiver_name: string;
  caregiver_email: string;
  child_name: string;
  amount_cents: number;
  slot: {
    starts_at: string;
    ends_at: string;
    programmes: {
      title: string;
      location: string | null;
    };
  } | null;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // 1. Read raw body
  let raw: string;
  try {
    raw = await readRawBody(req);
  } catch (err) {
    console.error("[webhook] read body failed", err);
    return res.status(400).json({ error: "read_failed" });
  }

  // 2. Verify signature
  const sigHeader = req.headers["stripe-signature"];
  const sig = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;

  let event;
  try {
    event = verifyWebhookSignature(raw, sig);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return res.status(400).json({ error: "invalid_signature" });
  }

  // 3. We only care about successful checkouts for now.
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const session = event.data.object as {
    id?: string;
    payment_intent?: string;
    metadata?: { booking_id?: string; booking_ids?: string };
    customer_email?: string;
  };

  // Prefer the multi-booking `booking_ids` (comma-separated) when present,
  // fall back to the legacy single `booking_id` for older Checkout sessions.
  const idsCsv = session.metadata?.booking_ids;
  const bookingIds: string[] = idsCsv
    ? idsCsv.split(",").map((s) => s.trim()).filter(Boolean)
    : session.metadata?.booking_id
      ? [session.metadata.booking_id]
      : [];

  if (bookingIds.length === 0) {
    console.warn("[webhook] checkout.session.completed missing booking metadata", session.id);
    return res.status(200).json({ received: true, warning: "no_booking_id" });
  }

  // 4. Mark every booking paid.
  try {
    const idList = bookingIds.map((id) => encodeURIComponent(id)).join(",");
    await sbPatch(`/rest/v1/bookings?id=in.(${idList})`, {
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
    });
  } catch (err) {
    console.error("[webhook] failed to mark booking paid", err);
    return res.status(200).json({ received: true, warning: "patch_failed" });
  }

  // 5. Fetch all booked rows so we can send ONE confirmation email listing
  //    every date. Each booking points to its own slot; we sort by start time
  //    so the email reads naturally.
  try {
    const idList = bookingIds.map((id) => encodeURIComponent(id)).join(",");
    const rows = await sbFetch<BookingRow[]>(
      `/rest/v1/bookings?id=in.(${idList})&select=id,caregiver_name,caregiver_email,child_name,amount_cents,slot:slot_id(starts_at,ends_at,programmes(title,location))`,
      { service: true },
    );
    if (!rows || rows.length === 0) {
      console.warn("[webhook] no booking rows found", bookingIds);
      return res.status(200).json({ received: true, warning: "no_rows" });
    }

    const sorted = [...rows]
      .filter((r) => r.slot)
      .sort((a, b) => (a.slot?.starts_at ?? "").localeCompare(b.slot?.starts_at ?? ""));
    if (sorted.length === 0) {
      console.warn("[webhook] booking rows missing slot info", bookingIds);
      return res.status(200).json({ received: true, warning: "no_slot_info" });
    }

    const head = sorted[0];
    const slotLabels = sorted.map((r) => formatSlotLabel(r.slot!.starts_at, r.slot!.ends_at));
    const totalCents = sorted.reduce((sum, r) => sum + (r.amount_cents ?? 0), 0);

    if (head.caregiver_email && head.slot) {
      const emailArgs = {
        to: head.caregiver_email,
        bookingId: head.id,
        caregiverName: head.caregiver_name,
        childName: head.child_name,
        programmeTitle: head.slot.programmes.title,
        slotLabels,
        amountCents: totalCents,
        location: head.slot.programmes.location ?? "Lane Park Business Centre, Upper Hutt",
      };
      await sendBookingConfirmation(emailArgs);
      // Fire-and-forget admin ping. Never blocks the webhook response.
      void sendAdminBookingNotification(emailArgs);
    } else {
      console.warn("[webhook] missing caregiver/slot details for confirmation email", bookingIds);
    }
  } catch (err) {
    console.error("[webhook] confirmation email failed (bookings still paid)", err);
  }

  return res.status(200).json({ received: true, bookings: bookingIds.length });
}

async function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const timer = setTimeout(() => reject(new Error("timeout")), 9_000);
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      clearTimeout(timer);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error" as never, (err: unknown) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function formatSlotLabel(startsAt: string, endsAt: string): string {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  const date = s.toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Pacific/Auckland",
  });
  const time = (d: Date) =>
    d.toLocaleTimeString("en-NZ", {
      hour: "numeric",
      hour12: true,
      timeZone: "Pacific/Auckland",
    });
  return `${date} · ${time(s)}–${time(e)}`;
}
