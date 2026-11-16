# Branded Supabase magic-link email

Paste this into **Supabase Dashboard → Authentication → Email Templates → Magic Link**.

## Subject

```
Sign in to Brick Engaged
```

## Message (HTML)

Replace the entire HTML body of the Magic Link template with the block below. Keep the
`{{ .ConfirmationURL }}` token — that's Supabase's placeholder for the actual link.

```html
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1E293B;padding:28px 32px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;opacity:.7;font-weight:700;">Brick Engaged</div>
                <div style="font-size:24px;font-weight:900;margin-top:6px;letter-spacing:-.02em;">Sign in to your account</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.55;">Hi there,</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.55;">
                  Click the button below to sign in to your Brick Engaged account. The link
                  works once and expires in 60 minutes.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 24px;">
                <a href="{{ .ConfirmationURL }}"
                   style="display:inline-block;background:#f4c542;color:#1E293B;text-decoration:none;font-weight:900;letter-spacing:.04em;padding:14px 28px;border-radius:10px;font-size:16px;border-bottom:4px solid #c69a1c;">
                  Sign in to Brick Engaged →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 18px;font-size:13px;line-height:1.55;color:#64748b;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color:#1E293B;word-break:break-all;">{{ .ConfirmationURL }}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:13px;line-height:1.55;color:#64748b;border-top:1px solid #f1f5f9;padding-top:18px;">
                Didn't ask to sign in? You can safely ignore this email — nothing will happen
                unless someone clicks the link.
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:13px;line-height:1.55;color:#64748b;">
                Need a hand? Reply to this email or text Dan on <a href="tel:0212700301" style="color:#1E293B;">021 270 0301</a>.
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#94a3b8;">
            © Brick Engaged · Upper Hutt, NZ · <a href="https://brickengaged.org" style="color:#94a3b8;">brickengaged.org</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
```

## What it changes

- **Subject** says "Sign in to Brick Engaged" instead of "Confirm your email address"
- **Header bar** is dark charcoal with "BRICK ENGAGED" in caps
- **Call-to-action button** is the yellow LEGO-brick yellow (`#f4c542`) matching the site
- **Body copy** is warm, NZ, brief — same voice as the booking confirmation emails
- **Phone number** included as a fallback contact

## Optional next step — send from `bookings@brickengaged.org`

Right now the email arrives from `noreply@mail.app.supabase.io`. To send it from a Brick Engaged address, set up **custom SMTP via Resend** (you already have the Resend account):

1. Verify the domain `brickengaged.org` in Resend dashboard. Resend will give you 3 DNS records (SPF/DKIM) to add at your DNS provider.
2. In Supabase Dashboard → Authentication → Email Templates → Configure SMTP, paste the Resend SMTP credentials:
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **Username**: `resend`
   - **Password**: your Resend API key (`re_...`)
   - **Sender email**: `bookings@brickengaged.org`
   - **Sender name**: `Brick Engaged`
3. Save. Future magic-link emails will come from `bookings@brickengaged.org`.

DNS records take ~10 min to propagate. Once they're live the change is immediate.
