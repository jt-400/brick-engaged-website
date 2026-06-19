// Lightweight Stripe wrapper that hits the REST API directly via fetch.
// Avoids pulling the `stripe` npm package into the api/ bundle so cold starts
// stay fast and we don't have to wire a separate package.json into the
// pnpm workspace.

import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SITE_URL = process.env.PUBLIC_SITE_URL ?? "";

if (!SECRET) console.warn("[stripe] STRIPE_SECRET_KEY missing");

/** Build the Basic auth header Stripe expects (secret-key as username, empty password). */
function authHeader() {
  if (!SECRET) throw new Error("STRIPE_SECRET_KEY not configured");
  return `Basic ${Buffer.from(`${SECRET}:`).toString("base64")}`;
}

/**
 * Encode a nested object as `application/x-www-form-urlencoded` using the
 * bracketed-key convention Stripe's REST API expects:
 *   { line_items: [{ price: "x", quantity: 1 }] }
 *     →  line_items[0][price]=x&line_items[0][quantity]=1
 */
function toForm(input: Record<string, unknown>, prefix = ""): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    const k = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item !== null && typeof item === "object") {
          parts.push(toForm(item as Record<string, unknown>, `${k}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${k}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === "object") {
      parts.push(toForm(value as Record<string, unknown>, k));
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.filter(Boolean).join("&");
}

export type CheckoutSession = {
  id: string;
  url: string;
  payment_intent?: string;
  metadata?: Record<string, string>;
};

interface CreateCheckoutArgs {
  bookingId: string;
  programmeTitle: string;
  slotLabel: string; // e.g. "Mon 16 Jun · 9am–4pm"
  amountCents: number;
  customerEmail: string;
  /** Where Stripe redirects on success — booking id is appended via `{CHECKOUT_SESSION_ID}` placeholder. */
  successPath?: string; // default "/book/confirmation/{BOOKING_ID}"
  cancelPath?: string;  // default "/book/holiday"
}

export async function createCheckoutSession(args: CreateCheckoutArgs): Promise<CheckoutSession> {
  const successPath = args.successPath ?? `/book/confirmation/${args.bookingId}`;
  const cancelPath = args.cancelPath ?? `/book/holiday`;

  const params: Record<string, unknown> = {
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: args.customerEmail,
    success_url: `${SITE_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}${cancelPath}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min hold (Stripe minimum)
    metadata: {
      booking_id: args.bookingId,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "nzd",
          unit_amount: args.amountCents,
          product_data: {
            name: args.programmeTitle,
            description: args.slotLabel,
          },
        },
      },
    ],
    payment_intent_data: {
      metadata: {
        booking_id: args.bookingId,
      },
    },
  };

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`stripe checkout.sessions create failed: ${res.status} ${text}`);
  }

  return (await res.json()) as CheckoutSession;
}

export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

/**
 * Verify a Stripe-Signature header against the raw request body.
 *
 * Stripe uses a "t=<unix>,v1=<hex hmac>,v1=<hex hmac>,..." format. We must
 *   1. parse out the timestamp and v1 signatures
 *   2. compute HMAC-SHA256 of `${t}.${rawBody}` with the webhook signing secret
 *   3. timing-safe compare against any of the provided v1 signatures
 *   4. reject if the timestamp is older than tolerance (5 min default)
 *
 * Returns the parsed event on success, throws on any failure.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  tolerance = 300,
): StripeWebhookEvent {
  if (!WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  if (!signatureHeader) throw new Error("missing Stripe-Signature header");

  const parts = signatureHeader.split(",").map((p) => p.trim());
  const ts = parts.find((p) => p.startsWith("t="))?.slice(2);
  const sigs = parts.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));

  if (!ts || sigs.length === 0) throw new Error("malformed Stripe-Signature");

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) throw new Error("invalid timestamp");
  if (Math.abs(Date.now() / 1000 - tsNum) > tolerance) {
    throw new Error("timestamp outside tolerance");
  }

  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(`${ts}.${rawBody}`, "utf8")
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const matched = sigs.some((sig) => {
    const sigBuf = Buffer.from(sig, "hex");
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });

  if (!matched) throw new Error("signature mismatch");

  return JSON.parse(rawBody) as StripeWebhookEvent;
}
