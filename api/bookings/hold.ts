// POST /api/bookings/hold
//
// 1. Validate the booking payload — supports either a single `slot_id` or
//    an array of `slot_ids` (for multi-day Holiday bookings).
// 2. Look up every requested slot (must all belong to the same programme).
// 3. Atomically reserve seats via the `book_slots` SQL RPC — locks each slot
//    in deterministic order, checks capacity, inserts a pending booking per
//    slot. If any slot is full the whole transaction rolls back.
// 4a. $0 programmes (peer-to-peer koha) — skip Stripe, mark all bookings paid,
//     send the confirmation email immediately.
// 4b. Paid programmes — create one Stripe Checkout session with a line item
//     per slot. Store the session id on every booking row.
// 5. Return `{ booking_id, booking_ids, checkout_url }` for the client to
//    redirect.

import { sbFetch, sbPatch, sbRpc } from "../_lib/supabase";
import { createCheckoutSession, type CheckoutLineItem } from "../_lib/stripe";
import { sendBookingConfirmation, sendAdminBookingNotification } from "../_lib/email";

const SITE_URL = process.env.PUBLIC_SITE_URL ?? "";
const MAX_SLOTS_PER_BOOKING = 14;

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
  slot_ids: string[];
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
  programme_id: string;
};

type ProgrammeRow = {
  slug: string;
  title: string;
  price_cents: number;
  location: string | null;
};

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const raw = typeof req.body === "string" ? safeJson(req.body) : req.body;
  const payload = parsePayload(raw);
  if (!payload) {
    return res.status(400).json({ error: "invalid_payload" });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Look up every slot + the shared programme.
  // ───────────────────────────────────────────────────────────────────────────
  let slots: SlotRow[];
  let programme: ProgrammeRow;
  try {
    const idList = payload.slot_ids.map((id) => encodeURIComponent(id)).join(",");
    const slotRows = await sbFetch<SlotRow[]>(
      `/rest/v1/slots?id=in.(${idList})&select=id,starts_at,ends_at,programme_id`,
      { service: true },
    );
    if (!slotRows || slotRows.length === 0) {
      return res.status(404).json({ error: "slot_not_found" });
    }
    if (slotRows.length !== payload.slot_ids.length) {
      return res.status(404).json({ error: "slot_not_found" });
    }

    const programmeIds = new Set(slotRows.map((s) => s.programme_id));
    if (programmeIds.size !== 1) {
      // All slots in one booking must belong to the same programme — keeps
      // pricing and email rendering simple, and matches every real use case.
      return res.status(400).json({ error: "mixed_programmes" });
    }
    const programmeId = slotRows[0].programme_id;

    const progRows = await sbFetch<ProgrammeRow[]>(
      `/rest/v1/programmes?id=eq.${programmeId}&select=slug,title,price_cents,location`,
      { service: true },
    );
    if (!progRows || progRows.length === 0) {
      return res.status(500).json({ error: "programme_not_found" });
    }

    // Sort slots chronologically so receipt line items and confirmation email
    // render in the natural order ("Mon 6 Jul", "Tue 7 Jul", …).
    slots = [...slotRows].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    programme = progRows[0];
  } catch (err) {
    console.error("[bookings/hold] slot lookup failed", err);
    return res.status(500).json({ error: "lookup_failed" });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Atomic capacity check + insert one pending booking per slot.
  // ───────────────────────────────────────────────────────────────────────────
  let bookingIds: string[];
  try {
    bookingIds = await sbRpc<string[]>(
      "book_slots",
      {
        p_slot_ids: payload.slot_ids,
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
    if (!bookingIds || bookingIds.length === 0) {
      throw new Error("book_slots returned no ids");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("slot_full")) return res.status(409).json({ error: "slot_full" });
    if (msg.includes("slot_unavailable")) return res.status(409).json({ error: "slot_unavailable" });
    console.error("[bookings/hold] book_slots rpc failed", err);
    return res.status(500).json({ error: "book_failed" });
  }

  const totalCents = programme.price_cents * slots.length;
  const slotLabels = slots.map((s) => formatSlotLabel(s.starts_at, s.ends_at));
  const firstBookingId = bookingIds[0];

  // ───────────────────────────────────────────────────────────────────────────
  // 3a. $0 fast path — peer-to-peer / donation. No Stripe; immediate confirmation.
  // ───────────────────────────────────────────────────────────────────────────
  if (programme.price_cents === 0) {
    try {
      const idList = bookingIds.map((id) => encodeURIComponent(id)).join(",");
      await sbPatch(`/rest/v1/bookings?id=in.(${idList})`, {
        status: "paid",
        paid_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[bookings/hold] failed to mark $0 bookings paid", err);
    }

    const emailArgs = {
      to: payload.caregiver_email,
      bookingId: firstBookingId,
      caregiverName: payload.caregiver_name,
      childName: payload.child_name,
      programmeTitle: programme.title,
      slotLabels,
      amountCents: 0,
      location: programme.location ?? "Lane Park Business Centre, Upper Hutt",
    };
    try {
      await sendBookingConfirmation(emailArgs);
    } catch (err) {
      console.error("[bookings/hold] $0 confirmation email failed (booking still saved)", err);
    }
    // Fire-and-forget admin ping — never blocks the customer flow.
    void sendAdminBookingNotification(emailArgs);

    return res.status(200).json({
      booking_id: firstBookingId,
      booking_ids: bookingIds,
      checkout_url: `${SITE_URL}/book/confirmation/${firstBookingId}`,
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3b. Paid path — one Stripe Checkout session, one line item per slot.
  // ───────────────────────────────────────────────────────────────────────────
  const lineItems: CheckoutLineItem[] = slots.map((s, i) => ({
    productName: programme.title,
    description: slotLabels[i] ?? formatSlotLabel(s.starts_at, s.ends_at),
    amountCents: programme.price_cents,
  }));

  let session: { id: string; url: string };
  try {
    session = await createCheckoutSession({
      bookingIds,
      customerEmail: payload.caregiver_email,
      lineItems,
    });
  } catch (err) {
    console.error("[bookings/hold] stripe session create failed", err);
    return res.status(500).json({ error: "stripe_failed" });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Persist stripe_session_id on every booking row so the webhook can find
  //    them by either metadata.booking_ids OR by stripe_session_id (defence in depth).
  // ───────────────────────────────────────────────────────────────────────────
  try {
    const idList = bookingIds.map((id) => encodeURIComponent(id)).join(",");
    await sbPatch(`/rest/v1/bookings?id=in.(${idList})`, {
      stripe_session_id: session.id,
    });
  } catch (err) {
    console.error("[bookings/hold] failed to patch session id (continuing)", err);
  }

  return res.status(200).json({
    booking_id: firstBookingId,
    booking_ids: bookingIds,
    checkout_url: session.url,
    total_cents: totalCents,
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

  // Accept either slot_ids (array, preferred) or slot_id (legacy single).
  let slot_ids: string[] = [];
  if (Array.isArray(p.slot_ids)) {
    slot_ids = p.slot_ids.filter((x): x is string => typeof x === "string" && x.length > 0);
  } else if (typeof p.slot_id === "string" && p.slot_id.length > 0) {
    slot_ids = [p.slot_id];
  }
  // Dedupe while preserving order
  slot_ids = Array.from(new Set(slot_ids));
  if (slot_ids.length === 0 || slot_ids.length > MAX_SLOTS_PER_BOOKING) return null;
  // Loose UUID shape check — Supabase will reject malformed ids anyway
  if (!slot_ids.every((id) => /^[0-9a-f-]{32,40}$/i.test(id))) return null;

  const child_name = strOrNull(p.child_name);
  const caregiver_name = strOrNull(p.caregiver_name);
  const caregiver_email = strOrNull(p.caregiver_email);
  if (!child_name || !caregiver_name || !caregiver_email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(caregiver_email)) return null;

  const child_age = numOrUndef(p.child_age);
  if (child_age !== undefined && (child_age < 4 || child_age > 18)) return null;

  return {
    slot_ids,
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
