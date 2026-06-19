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
import { sendBookingConfirmation } from "../_lib/email";

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
    metadata?: { booking_id?: string };
    customer_email?: string;
  };

  const bookingId = session.metadata?.booking_id;
  if (!bookingId) {
    console.warn("[webhook] checkout.session.completed missing booking_id metadata", session.id);
    return res.status(200).json({ received: true, warning: "no_booking_id" });
  }

  // 4. Mark booking paid.
  try {
    await sbPatch(`/rest/v1/bookings?id=eq.${bookingId}`, {
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
    });
  } catch (err) {
    console.error("[webhook] failed to mark booking paid", err);
    // Don't 5xx — Stripe would retry. We've recorded the warning;
    // admin can reconcile manually if needed.
    return res.status(200).json({ received: true, warning: "patch_failed" });
  }

  // 5. Fetch booking + slot + programme for the confirmation email.
  try {
    const rows = await sbFetch<BookingRow[]>(
      `/rest/v1/bookings?id=eq.${bookingId}&select=id,caregiver_name,caregiver_email,child_name,amount_cents,slot:slot_id(starts_at,ends_at,programmes(title,location))`,
      { service: true },
    );
    const booking = rows?.[0];
    if (booking?.caregiver_email && booking.slot) {
      await sendBookingConfirmation({
        to: booking.caregiver_email,
        bookingId: booking.id,
        caregiverName: booking.caregiver_name,
        childName: booking.child_name,
        programmeTitle: booking.slot.programmes.title,
        slotLabel: formatSlotLabel(booking.slot.starts_at, booking.slot.ends_at),
        amountCents: booking.amount_cents,
        location: booking.slot.programmes.location ?? "Lane Park Business Centre, Upper Hutt",
      });
    } else {
      console.warn("[webhook] missing booking details for confirmation email", bookingId);
    }
  } catch (err) {
    console.error("[webhook] confirmation email failed (booking still paid)", err);
    // Email failure is non-fatal — booking is marked paid, admin can resend.
  }

  return res.status(200).json({ received: true });
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
