// POST /api/contact
//
// Contact form submission handler. Validates the payload, emails info@ (via
// ADMIN_NOTIFY_EMAIL) with the message, and optionally sends the visitor a
// short "we got your note" auto-reply.
//
// Rate limiting: none for now — Brevo will drop obvious spam and Vercel's
// per-function limits catch anything abusive. Add a token bucket per IP if
// spam becomes a real problem.

import { sendEmail } from "./_lib/email";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";

type ReqLike = {
  method?: string;
  body?: unknown;
};
type ResLike = {
  setHeader: (k: string, v: string) => void;
  status: (c: number) => ResLike;
  json: (b: unknown) => ResLike;
};

interface Payload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const p = (req.body ?? {}) as Payload;
  const name = String(p.name ?? "").trim();
  const email = String(p.email ?? "").trim();
  const subject = String(p.subject ?? "").trim();
  const message = String(p.message ?? "").trim();

  if (!name || name.length < 2) return res.status(400).json({ error: "name_required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "email_invalid" });
  if (!subject || subject.length < 2) return res.status(400).json({ error: "subject_required" });
  if (!message || message.length < 10) return res.status(400).json({ error: "message_too_short" });

  if (!ADMIN_EMAIL) {
    console.error("[contact] ADMIN_NOTIFY_EMAIL not configured — dropping submission on the floor");
    return res.status(500).json({ error: "not_configured" });
  }

  // 1. Send the submission to info@brickengaged.org.
  const adminSubject = `Website enquiry · ${subject}`;
  const adminText = [
    `New website enquiry from ${name} <${email}>`,
    ``,
    `Subject: ${subject}`,
    ``,
    message,
    ``,
    `---`,
    `Reply directly to this email to answer them (their address is in the Reply-To header).`,
  ].join("\n");

  const adminHtml = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1E293B;padding:22px 28px;color:#ffffff;">
                <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#ffe527;font-weight:800;">Website enquiry</div>
                <div style="font-size:20px;font-weight:900;margin-top:4px;letter-spacing:-.02em;">${escape(subject)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 4px;font-size:15px;line-height:1.55;">
                From <strong>${escape(name)}</strong>
                &lt;<a href="mailto:${escape(email)}" style="color:#1E293B;">${escape(email)}</a>&gt;
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 20px;">
                <div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escape(message)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;font-size:13px;color:#64748b;line-height:1.55;">
                Just hit reply to answer them directly — the reply-to on this email is set to ${escape(email)}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: adminSubject,
      html: adminHtml,
      text: adminText,
      replyTo: { email, name },
    });
  } catch (err) {
    console.error("[contact] admin email failed", err);
    return res.status(500).json({ error: "send_failed" });
  }

  // 2. Best-effort auto-reply to the visitor. Failures here don't block success.
  try {
    await sendEmail({
      to: email,
      subject: "We got your message — Brick Engaged",
      html: buildAutoreplyHtml(name),
      text: buildAutoreplyText(name),
    });
  } catch (err) {
    console.error("[contact] visitor auto-reply failed (non-fatal)", err);
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true });
}

function buildAutoreplyHtml(name: string) {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1E293B;padding:26px 32px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;opacity:.7;font-weight:700;">Message received</div>
                <div style="font-size:24px;font-weight:900;margin-top:6px;letter-spacing:-.02em;">Brick Engaged</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 12px;">Hi ${escape(name)},</p>
                <p style="margin:0 0 12px;">Thanks for reaching out. Dan reads every message himself and usually replies within a day or two.</p>
                <p style="margin:0 0 12px;">If it's urgent, you can text him on <a href="tel:0212700301" style="color:#1E293B;">021 270 0301</a>.</p>
                <p style="margin:0;">Chat soon,<br>— Brick Engaged</p>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:11px;color:#94a3b8;">This is an automated reply. To follow up, just reply to this email.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildAutoreplyText(name: string) {
  return [
    `Hi ${name},`,
    ``,
    `Thanks for reaching out. Dan reads every message himself and usually replies within a day or two.`,
    ``,
    `If it's urgent, text him on 021 270 0301.`,
    ``,
    `Chat soon,`,
    `— Brick Engaged`,
  ].join("\n");
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
