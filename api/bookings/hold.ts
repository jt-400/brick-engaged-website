// POST /api/bookings/hold
//
// 1. Validate the booking form payload.
// 2. Look up the slot + its programme (for price + title on the Stripe line item).
// 3. Atomically reserve a seat via the `book_slot` SQL function (SELECT FOR
//    UPDATE on the slot row, capacity check, insert pending booking).
// 4. Create a Stripe Checkout session for the slot's price.
// 5. Persist `stripe_session_id` on the booking so the webhook can find it.
// 6. Return `{ booking_id, checkout_url }` for the client to redirect.
//
// If anything after the booking insert fails we leave the booking as `pending`;
// the 10-minute availability filter sweeps it automatically and the seat
// becomes bookable again.

import { sbFetch, sbPatch, sbRpc } from "../_lib/supabase";
import { createCheckoutSession } from "../_lib/stripe";

interface ReqLike {
  method?: string;
  body?: unknown;
}
interface ResLike {
  setHeader: (k: string, v: string) => void;
  status: (c: number) => ResLike;
  json: (b: unknown) => ResLike;
}

type BookingPayload = {
  slot_id: string;
  child_name: string;
  child_age?: number;
  caregiver_name: string;
  caregiver_email: string;
  caregiver_phone?: string;
  consent?: Record<string, unknown>;
  notes?: string;
};

type SlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  programmes: {
    slug: string;
    title: string;
    price_cents: number;
    location: string | null;
  };
};

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // Vercel auto-parses JSON when Content-Type is application/json; if a client
  // sent a raw string we tolerate that too.
  const raw = typeof req.body === "string" ? safeJson(req.body) : req.body;
  const payload = parsePayload(raw);
  if (!payload) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  // 1. Look up slot + programme so we can build the Stripe line item.
  //    Uses the service-role key so RLS doesn't block `slots`.
  let slot: SlotRow;
  try {
    const rows = await sbFetch<SlotRow[]>(
      `/rest/v1/slots?id=eq.${payload.slot_id}&select=id,starts_at,ends_at,programmes(slug,title,price_cents,location)`,
      { service: true },
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "slot_not_found" });
    }
    slot = rows[0];
  } catch (err) {
    console.error("[bookings/hold] slot lookup failed", err);
    return res.status(500).json({ error: "lookup_failed" });
  }

  // 2. Atomic capacity check + insert pending booking.
  let bookingId: string;
  try {
    bookingId = await sbRpc<string>(
      "book_slot",
      {
        p_slot_id: payload.slot_id,
        p_child_name: payload.child_name,
        p_child_age: payload.child_age ?? null,
        p_caregiver_name: payload.caregiver_name,
        p_caregiver_email: payload.caregiver_email,
        p_caregiver_phone: payload.caregiver_phone ?? null,
        p_consent: payload.consent ?? {},
        p_notes: payload.notes ?? null,
      },
      { service: true },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("slot_full")) return res.status(409).json({ error: "slot_full" });
    if (msg.includes("slot_unavailable")) return res.status(409).json({ error: "slot_unavailable" });
    console.error("[bookings/hold] book_slot rpc failed", err);
    return res.status(500).json({ error: "book_failed" });
  }

  // 3. Stripe Checkout session.
  let session: { id: string; url: string };
  try {
    session = await createCheckoutSession({
      bookingId,
      programmeTitle: slot.programmes.title,
      slotLabel: formatSlotLabel(slot.starts_at, slot.ends_at),
      amountCents: slot.programmes.price_cents,
      customerEmail: payload.caregiver_email,
    });
  } catch (err) {
    console.error("[bookings/hold] stripe session create failed", err);
    // Don't try to rollback the booking — the availability filter will
    // expire the pending hold in 10 minutes. Just surface the error.
    return res.status(500).json({ error: "stripe_failed" });
  }

  // 4. Persist stripe_session_id so the webhook can locate the booking row.
  try {
    await sbPatch(`/rest/v1/bookings?id=eq.${bookingId}`, {
      stripe_session_id: session.id,
    });
  } catch (err) {
    console.error("[bookings/hold] failed to patch session id (continuing)", err);
    // Non-fatal: webhook can fall back to metadata.booking_id from the
    // Checkout Session itself. Don't fail the request.
  }

  return res.status(200).json({
    booking_id: bookingId,
    checkout_url: session.url,
  });
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function parsePayload(input: unknown): BookingPayload | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;

  const slot_id = strOrNull(p.slot_id);
  const child_name = strOrNull(p.child_name);
  const caregiver_name = strOrNull(p.caregiver_name);
  const caregiver_email = strOrNull(p.caregiver_email);
  if (!slot_id || !child_name || !caregiver_name || !caregiver_email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caregiver_email)) return null;

  const child_age = numOrUndef(p.child_age);
  if (child_age !== undefined && (child_age < 4 || child_age > 18)) return null;

  return {
    slot_id,
    child_name: child_name.trim().slice(0, 80),
    child_age,
    caregiver_name: caregiver_name.trim().slice(0, 80),
    caregiver_email: caregiver_email.trim().toLowerCase().slice(0, 120),
    caregiver_phone: strOrNull(p.caregiver_phone)?.trim().slice(0, 30) ?? undefined,
    consent: typeof p.consent === "object" && p.consent ? (p.consent as Record<string, unknown>) : undefined,
    notes: strOrNull(p.notes)?.trim().slice(0, 1000) ?? undefined,
  };
}

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}
function numOrUndef(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
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
