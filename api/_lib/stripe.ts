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

export interface CheckoutLineItem {
  productName: string;
  description: string;
  amountCents: number;
}

interface CreateCheckoutArgs {
  /**
   * Every booking row this checkout covers. Comma-joined into Stripe metadata
   * so the webhook can mark all of them paid on `checkout.session.completed`.
   * One booking → single-slot path. Many → multi-day path (e.g. Holiday).
   */
  bookingIds: string[];
  customerEmail: string;
  /** One line item per booking — Stripe renders each on the receipt. */
  lineItems: CheckoutLineItem[];
  /** Where Stripe redirects on success. Defaults to /book/confirmation/<first-booking-id>. */
  successPath?: string;
  cancelPath?: string;
}

export async function createCheckoutSession(args: CreateCheckoutArgs): Promise<CheckoutSession> {
  if (args.bookingIds.length === 0) {
    throw new Error("createCheckoutSession: bookingIds must not be empty");
  }
  if (args.lineItems.length === 0) {
    throw new Error("createCheckoutSession: lineItems must not be empty");
  }

  const successPath = args.successPath ?? `/book/confirmation/${args.bookingIds[0]}`;
  const cancelPath = args.cancelPath ?? `/book/holiday`;
  // Comma-joined IDs are well under Stripe's 500-char metadata-value limit
  // (8 UUIDs × 37 chars ≈ 296). Webhook splits on "," to mark them paid.
  const bookingIdsCsv = args.bookingIds.join(",");

  const params: Record<string, unknown> = {
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: args.customerEmail,
    success_url: `${SITE_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}${cancelPath}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min hold (Stripe minimum)
    metadata: {
      booking_ids: bookingIdsCsv,
      // Legacy single-booking key kept for compatibility with older webhook
      // logic; webhook prefers booking_ids when present.
      booking_id: args.bookingIds[0],
    },
    line_items: args.lineItems.map((li) => ({
      quantity: 1,
      price_data: {
        currency: "nzd",
        unit_amount: li.amountCents,
        product_data: {
          name: li.productName,
          description: li.description,
        },
      },
    })),
    payment_intent_data: {
      metadata: {
        booking_ids: bookingIdsCsv,
        booking_id: args.bookingIds[0],
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
