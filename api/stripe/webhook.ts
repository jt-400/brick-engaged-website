// POST /api/stripe/webhook
// Stripe sends checkout.session.completed events here.
// Vercel needs raw body parsing for signature verification.

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
  end: (s?: string) => void;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] Stripe not configured");
    return res.status(500).json({ error: "stripe_not_configured" });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  // Read raw body
  const raw = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    // Safety timeout
    setTimeout(() => reject(new Error("timeout")), 10_000);
  });

  const sig = (req.headers["stripe-signature"] as string) ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return res.status(400).json({ error: "invalid_signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      return res.status(200).json({ received: true });
    }

    // Mark booking as paid
    const { sbPatch, sbFetch } = await import("../_lib/supabase");

    await sbPatch(`/rest/v1/bookings?id=eq.${bookingId}`, {
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    });

    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      try {
        const bookingData = await sbFetch<any[]>(
          `/rest/v1/bookings?id=eq.${bookingId}&select=*,slot:slot_id(starts_at,ends_at)`,
          { service: true }
        );

        const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

        if (booking?.caregiver_email) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);

          const slotDate = booking.slot?.starts_at
            ? new Date(booking.slot.starts_at).toLocaleDateString("en-NZ", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Pacific/Auckland",
              })
            : "See your booking";

          await resend.emails.send({
            from: "Brick Engaged <bookings@resend.dev>",
            to: booking.caregiver_email,
            subject: "Booking confirmed — Brick Engaged",
            html: `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
                <div style="background: #f4c542; padding: 24px; border-radius: 12px 12px 0 0;">
                  <h1 style="margin:0; color:#1E293B;">Booking Confirmed!</h1>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
                  <p>Hi <strong>${booking.caregiver_name}</strong>,</p>
                  <p>Your holiday session for <strong>${booking.child_name}</strong> is confirmed.</p>
                  <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                    <tr><td style="padding: 8px; font-weight: bold; color: #475569;">When</td>
                        <td style="padding: 8px;">${slotDate}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Time</td>
                        <td style="padding: 8px;">9:00am – 4:00pm</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Location</td>
                        <td style="padding: 8px;">Lane Park Business Centre, Upper Hutt</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Reference</td>
                        <td style="padding: 8px; font-family: monospace;">${bookingId.slice(0, 8)}</td></tr>
                  </table>
                  <p style="color: #64748b; font-size: 14px;">
                    If you have any questions, contact Dan at <strong>021 270 0301</strong> or
                    <a href="mailto:info@brickengaged.org">info@brickengaged.org</a>.
                  </p>
                  <p style="color: #64748b; font-size: 14px;">See you there! 🧱</p>
                </div>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("[webhook] email send failed", emailErr);
      }
    }
  }

  return res.status(200).json({ received: true });
}
