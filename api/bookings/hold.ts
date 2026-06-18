// POST /api/bookings/hold
// Atomic slot reservation → Stripe Checkout URL
//
// Request:
//   { slot_id, child_name, child_age?, caregiver_name, caregiver_email,
//     caregiver_phone?, consent?, notes? }
//
// Response 201: { booking_id, url }
// Response 409: { error: "slot_full" }
// Response 400/500: { error: "..." }

import { sbRpc, sbPatch } from "../_lib/supabase";

type ReqLike = {
  method?: string;
  body?: string;
};
type ResLike = {
  setHeader: (k: string, v: string) => void;
  status: (c: number) => ResLike;
  json: (b: unknown) => ResLike;
};

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "stripe_not_configured" });
  }

  // Dynamic import — keeps cold start fast when env not set
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(req.body ?? "{}");
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  const {
    slot_id,
    child_name,
    child_age,
    caregiver_name,
    caregiver_email,
    caregiver_phone,
    consent,
    notes,
  } = body as Record<string, any>;

  if (!slot_id || !child_name || !caregiver_name || !caregiver_email) {
    return res.status(400).json({ error: "missing_required_fields" });
  }

  // 1. Atomic slot reservation via Supabase RPC
  let booking_id: string;
  try {
    booking_id = await sbRpc<string>("book_slot", {
      p_slot_id: slot_id,
      p_child_name: child_name,
      p_child_age: child_age ?? null,
      p_caregiver_name: caregiver_name,
      p_caregiver_email: caregiver_email,
      p_caregiver_phone: caregiver_phone ?? "",
      p_consent: consent ?? {},
      p_notes: notes ?? "",
    }, { service: true });
  } catch (err: any) {
    const msg = err?.message ?? "";
    if (msg.includes("slot_full") || msg.includes("slot_unavailable")) {
      return res.status(409).json({ error: "slot_full" });
    }
    console.error("[hold] book_slot failed", err);
    return res.status(500).json({ error: "booking_failed" });
  }

  // 2. Get programme details for Stripe line item
  let programmeData: any[] | null = null;
  try {
    programmeData = await sbRpc<any[]>("get_programme_for_slot", {
      p_slot_id: slot_id,
    }, { service: true });
  } catch {
    // fallback to defaults
  }

  const priceCents = programmeData?.[0]?.price_cents ?? 11500;
  const programmeTitle = programmeData?.[0]?.title ?? "School Holiday Programme";

  // 3. Create Stripe Checkout Session
  const BASE_URL =
    process.env.BASE_URL ?? "https://brick-engaged-website.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "nzd",
          product_data: {
            name: programmeTitle,
            description: `Slot for ${child_name}`,
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id,
      slot_id,
    },
    success_url: `${BASE_URL}/book/confirmation/${booking_id}`,
    cancel_url: `${BASE_URL}/holiday`,
    customer_email: caregiver_email,
  });

  // 4. Store the Stripe session id on the booking
  try {
    await sbPatch(`/rest/v1/bookings?id=eq.${booking_id}`, {
      stripe_session_id: session.id,
    });
  } catch (err) {
    console.error("[hold] failed to update booking with session id", err);
    // Non-fatal — the booking is created, redirect still works
  }

  // 5. Return the checkout URL
  return res.status(201).json({
    booking_id,
    url: session.url,
  });
}
