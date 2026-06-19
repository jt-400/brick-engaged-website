// Resend email helper. Plain fetch — keeps the api/ bundle small.
//
// Phase 2 only needs one template (booking confirmation). When we add
// reminders/waitlist in Phase 7 we'll grow this into a tiny template module.

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

if (!API_KEY) console.warn("[email] RESEND_API_KEY missing");

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback. Recommended — improves deliverability. */
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  if (!API_KEY) throw new Error("RESEND_API_KEY not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`resend send failed: ${res.status} ${body}`);
  }
}

interface BookingConfirmationArgs {
  to: string;
  bookingId: string;
  caregiverName: string;
  childName: string;
  programmeTitle: string;
  slotLabel: string; // "Mon 16 Jun · 9am–4pm"
  amountCents: number;
  location: string;
}

export function sendBookingConfirmation(args: BookingConfirmationArgs) {
  const amount = `$${(args.amountCents / 100).toFixed(2)} NZD`;
  const text = [
    `Hi ${args.caregiverName},`,
    ``,
    `Thanks for booking ${args.childName} into the Brick Engaged ${args.programmeTitle}.`,
    ``,
    `Date: ${args.slotLabel}`,
    `Location: ${args.location}`,
    `Amount paid: ${amount}`,
    `Booking reference: ${args.bookingId}`,
    ``,
    `What to bring: a packed lunch, drink bottle, and a smile.`,
    `Arrival: doors open 8:45am. Please pick up by 4:00pm.`,
    ``,
    `If you need to reach Dan, reply to this email or text 021 270 0301.`,
    ``,
    `See you soon!`,
    `— Brick Engaged`,
  ].join("\n");

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1E293B;padding:28px 32px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;opacity:.7;font-weight:700;">Booking confirmed</div>
                <div style="font-size:24px;font-weight:900;margin-top:6px;letter-spacing:-.02em;">Brick Engaged</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 12px;font-size:16px;">Hi ${escape(args.caregiverName)},</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.55;">
                  Thanks for booking <strong>${escape(args.childName)}</strong> into our
                  <strong>${escape(args.programmeTitle)}</strong>. You're all set.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;border-radius:12px;">
                  <tr><td style="padding:14px 18px;font-size:14px;"><strong style="display:inline-block;width:120px;">Date</strong>${escape(args.slotLabel)}</td></tr>
                  <tr><td style="padding:14px 18px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:120px;">Location</strong>${escape(args.location)}</td></tr>
                  <tr><td style="padding:14px 18px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:120px;">Amount paid</strong>${amount}</td></tr>
                  <tr><td style="padding:14px 18px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:120px;">Reference</strong><code style="font-size:12px;color:#64748b;">${escape(args.bookingId)}</code></td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <h3 style="font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:#64748b;margin:0 0 10px;">Before the day</h3>
                <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.6;">
                  <li>Pack a lunch and a drink bottle</li>
                  <li>Doors open 8:45am — please collect by 4:00pm</li>
                  <li>Wear clothes you don't mind getting LEGO-dust on</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:14px;color:#64748b;line-height:1.55;">
                Need to reach Dan? Reply to this email or text <a href="tel:0212700301" style="color:#1E293B;">021 270 0301</a>.
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#94a3b8;">© Brick Engaged · Upper Hutt, NZ</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return sendEmail({ to: args.to, subject: `Booking confirmed — ${args.programmeTitle}`, html, text });
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
