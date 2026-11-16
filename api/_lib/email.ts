// Brevo (formerly SendinBlue) transactional email helper. Plain fetch — no
// SMTP library dep, keeps the Vercel function bundle small + cold starts fast.
//
// We use Brevo's HTTP API (not SMTP) for booking confirmation emails. Supabase
// Auth handles its own emails via Brevo SMTP (configured separately in
// dashboard).

const API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "noreply@brickengaged.org";
const FROM_NAME = process.env.BREVO_FROM_NAME ?? "Brick Engaged";
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";

if (!API_KEY) console.warn("[email] BREVO_API_KEY missing");

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback. Improves deliverability + accessible to screen readers. */
  text?: string;
  /**
   * Optional reply-to override. Handy for the contact form — the admin gets
   * a mail from `noreply@brickengaged.org` but can hit reply and land back
   * at the visitor's inbox.
   */
  replyTo?: { email: string; name?: string };
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendArgs): Promise<void> {
  if (!API_KEY) throw new Error("BREVO_API_KEY not configured");

  const body: Record<string, unknown> = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };
  if (text) body.textContent = text;
  if (replyTo?.email) {
    body.replyTo = replyTo.name
      ? { email: replyTo.email, name: replyTo.name }
      : { email: replyTo.email };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const reason = await res.text();
    throw new Error(`brevo send failed: ${res.status} ${reason}`);
  }
}

interface BookingConfirmationArgs {
  to: string;
  /** Use the first booking id as the receipt reference. */
  bookingId: string;
  caregiverName: string;
  childName: string;
  programmeTitle: string;
  /**
   * One or more session labels — e.g. ["Mon 6 Jul · 9am–4pm", "Tue 7 Jul · 9am–4pm"].
   * For single-slot bookings pass an array of one. The email renders a list
   * when there are multiple.
   */
  slotLabels: string[];
  /** Total paid across all slots. */
  amountCents: number;
  location: string;
}

export function sendBookingConfirmation(args: BookingConfirmationArgs) {
  const amount = `$${(args.amountCents / 100).toFixed(2)} NZD`;
  const multi = args.slotLabels.length > 1;
  const datesText = args.slotLabels.map((l) => `  • ${l}`).join("\n");

  const text = [
    `Hi ${args.caregiverName},`,
    ``,
    `Thanks for booking ${args.childName} into the Brick Engaged ${args.programmeTitle}.`,
    ``,
    multi ? `Dates booked:` : `Date:`,
    multi ? datesText : `  ${args.slotLabels[0] ?? ""}`,
    ``,
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
                  <tr><td style="padding:14px 18px;font-size:14px;vertical-align:top;">
                    <strong style="display:inline-block;width:120px;vertical-align:top;">${multi ? "Dates" : "Date"}</strong>
                    ${multi
                      ? `<span style="display:inline-block;">${args.slotLabels.map((l) => escape(l)).join("<br>")}</span>`
                      : escape(args.slotLabels[0] ?? "")}
                  </td></tr>
                  <tr><td style="padding:14px 18px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:120px;">Location</strong>${escape(args.location)}</td></tr>
                  <tr><td style="padding:14px 18px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:120px;">Amount paid</strong>${amount}${multi ? ` <span style="color:#64748b;">(${args.slotLabels.length} days)</span>` : ""}</td></tr>
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

/**
 * Fire-and-forget admin ping. Sent alongside the customer confirmation so
 * Dan sees a new booking land in his inbox without having to open the admin
 * page. Silently no-ops if ADMIN_NOTIFY_EMAIL isn't configured, and swallows
 * failures — the customer confirmation is the source of truth.
 */
export async function sendAdminBookingNotification(args: BookingConfirmationArgs) {
  if (!ADMIN_NOTIFY_EMAIL) return;

  const amount = args.amountCents === 0 ? "$0 (koha)" : `$${(args.amountCents / 100).toFixed(2)} NZD`;
  const multi = args.slotLabels.length > 1;
  const datesText = args.slotLabels.map((l) => `  • ${l}`).join("\n");

  const text = [
    `New booking on brickengaged.org`,
    ``,
    `Programme: ${args.programmeTitle}`,
    `Child: ${args.childName}`,
    `Caregiver: ${args.caregiverName} <${args.to}>`,
    ``,
    multi ? `Dates:` : `Date:`,
    multi ? datesText : `  ${args.slotLabels[0] ?? ""}`,
    ``,
    `Amount: ${amount}`,
    `Reference: ${args.bookingId}`,
    ``,
    `See it in the admin panel: https://brickengaged.org/admin/bookings`,
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
              <td style="background:#1E293B;padding:22px 28px;color:#ffffff;">
                <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#ffe527;font-weight:800;">Admin notification</div>
                <div style="font-size:20px;font-weight:900;margin-top:4px;letter-spacing:-.02em;">New booking</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 4px;font-size:15px;line-height:1.55;">
                <strong>${escape(args.caregiverName)}</strong> booked <strong>${escape(args.childName)}</strong> into <strong>${escape(args.programmeTitle)}</strong>.
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 4px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;border-radius:12px;">
                  <tr><td style="padding:12px 16px;font-size:14px;vertical-align:top;">
                    <strong style="display:inline-block;width:100px;vertical-align:top;">${multi ? "Dates" : "Date"}</strong>
                    ${multi
                      ? `<span style="display:inline-block;">${args.slotLabels.map((l) => escape(l)).join("<br>")}</span>`
                      : escape(args.slotLabels[0] ?? "")}
                  </td></tr>
                  <tr><td style="padding:12px 16px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:100px;">Contact</strong><a href="mailto:${escape(args.to)}" style="color:#1E293B;">${escape(args.to)}</a></td></tr>
                  <tr><td style="padding:12px 16px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:100px;">Amount</strong>${amount}${multi ? ` <span style="color:#64748b;">(${args.slotLabels.length} days)</span>` : ""}</td></tr>
                  <tr><td style="padding:12px 16px;font-size:14px;border-top:1px solid #e2e8f0;"><strong style="display:inline-block;width:100px;">Reference</strong><code style="font-size:12px;color:#64748b;">${escape(args.bookingId)}</code></td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 24px;font-size:14px;line-height:1.55;">
                <a href="https://brickengaged.org/admin/bookings" style="display:inline-block;background:#ffe527;color:#1E293B;font-weight:900;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;letter-spacing:.04em;">
                  Open in admin →
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:11px;color:#94a3b8;">Sent to ${escape(ADMIN_NOTIFY_EMAIL)} because you're on the Brick Engaged admin notify list.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    await sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      subject: `New booking · ${args.programmeTitle} · ${args.childName}`,
      html,
      text,
    });
  } catch (err) {
    // Never let admin-notify failures block the customer flow.
    console.error("[email] admin notification failed", err);
  }
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
