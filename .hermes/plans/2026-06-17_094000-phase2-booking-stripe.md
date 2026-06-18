# Phase 2: Holiday Booking + Stripe Checkout

> **Goal:** Allow parents to book a holiday day slot end-to-end — pick a date from the calendar, fill in child/caregiver details, pay via Stripe, receive a confirmation email.

**Architecture:** The holiday page's CalendarGrid gets a selected date state. When a user picks an open day, a booking form slides in below. On submit, the API atomically reserves the slot (via the existing `book_slot` RPC), creates a Stripe Checkout Session, and redirects. Stripe's webhook fires `checkout.session.completed` → we mark the booking `paid` and send a Resend email.

**Tech Stack:** Vite/React 19 (wouter), react-hook-form + Zod, Stripe Checkout (hosted), Resend (email), Vercel serverless functions, Supabase Postgres.

**Current state:**
- Supabase project live (Sydney), schema + RPCs deployed, seed data loaded
- 3 env vars set in Vercel: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Calendar on `/holiday` showing live availability with "10 left" badges
- Contact form pattern at `Contact.tsx:156-235` using `useForm` + `zodResolver` + `<Form>` / `<FormField>` / `<Input>`

---

## Tasks

### Task 1: Create Stripe + Resend accounts and get keys

**Objective:** Set up the external service accounts needed for Phase 2.

**Details:**

1. **Stripe:**
   - Go to https://dashboard.stripe.com/register
   - Create an account (or log in if you have one)
   - From the Stripe Dashboard → Developers → API keys, copy:
     - `STRIPE_SECRET_KEY` (starts with `sk_test_...`)
     - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_...`)
   - Stripe CLI: optional but useful for local webhook testing
     ```sh
     brew install stripe/stripe-cli/stripe
     stripe login
     ```

2. **Resend:**
   - Go to https://resend.com → Sign up
   - Verify a domain (or use the sandbox `@resend.dev` email for testing)
   - Create an API key from API Keys section → copy `RESEND_API_KEY`
   - The from-address for confirmation emails will be something like `Brick Engaged <bookings@resend.dev>` (until a custom domain is verified)

3. **Store these locally** for now — we'll add them to Vercel in Task 6.

---

### Task 2: Create `POST /api/bookings/hold` endpoint

**Objective:** Atomic slot reservation that returns a Stripe Checkout URL.

**Files:**
- Create: `api/bookings/hold.ts`
- Uses: `api/_lib/supabase.ts` (already exists)

**Details:**

```typescript
// POST /api/bookings/hold
// Request body:
// {
//   slot_id: string,
//   child_name: string,
//   child_age: number | null,
//   caregiver_name: string,
//   caregiver_email: string,
//   caregiver_phone: string,
//   consent: Record<string, unknown>,
//   notes: string
// }
//
// 1. Call Supabase RPC `book_slot(...)` — atomic, SELECT FOR UPDATE
// 2. If slot_full → 409 Conflict
// 3. Create Stripe Checkout Session with booking_id in metadata
// 4. Update booking with stripe_session_id
// 5. Return { url: "https://checkout.stripe.com/..." }

import Stripe from "stripe";
import { sbRpc } from "../_lib/supabase";

// Minimal structural types (same pattern as availability.ts)
type ReqLike = {
  method?: string;
  body?: string; // raw body
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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(req.body ?? "{}");
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  const { slot_id, child_name, child_age, caregiver_name, caregiver_email, caregiver_phone, consent, notes } = body as any;

  // Validate required fields
  if (!slot_id || !child_name || !caregiver_name || !caregiver_email) {
    return res.status(400).json({ error: "missing_required_fields" });
  }

  // 1. Atomic slot reservation
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
    const msg = err.message ?? "";
    if (msg.includes("slot_full") || msg.includes("slot_unavailable")) {
      return res.status(409).json({ error: "slot_full" });
    }
    console.error("[hold] book_slot failed", err);
    return res.status(500).json({ error: "booking_failed" });
  }

  // 2. Get programme details for the Stripe line item
  const programme = await sbRpc<any[]>(
    "get_programme_for_slot",
    { p_slot_id: slot_id },
    { service: true }
  );

  const priceCents = programme?.[0]?.price_cents ?? 11500;
  const programmeTitle = programme?.[0]?.title ?? "School Holiday Programme";

  // 3. Create Stripe Checkout Session
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
    success_url: `${process.env.BASE_URL ?? "https://brick-engaged-website.vercel.app"}/book/confirmation/${booking_id}`,
    cancel_url: `${process.env.BASE_URL ?? "https://brick-engaged-website.vercel.app"}/holiday`,
    customer_email: caregiver_email,
  });

  // 4. Store the Stripe session id on the booking
  await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/bookings?id=eq.${booking_id}`,
    {
      method: "PATCH",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stripe_session_id: session.id }),
    }
  );

  // 5. Return the checkout URL
  return res.status(201).json({
    booking_id,
    url: session.url,
  });
}
```

**New RPC needed in Supabase** — `get_programme_for_slot`:

```sql
create or replace function public.get_programme_for_slot(p_slot_id uuid)
returns table (price_cents integer, title text)
language sql
stable
security definer
set search_path = public
as $$
  select p.price_cents, p.title
  from public.slots s
  join public.programmes p on p.id = s.programme_id
  where s.id = p_slot_id;
$$;
```

**Verification:** `curl -X POST` with a valid slot_id returns 201 with a Stripe URL.

---

### Task 3: Create `POST /api/stripe/webhook` endpoint

**Objective:** Handle Stripe webhook events — mark booking as paid on `checkout.session.completed`, send confirmation email.

**Files:**
- Create: `api/stripe/webhook.ts`

**Details:**

```typescript
// POST /api/stripe/webhook
// Stripe sends events here after checkout completion.
// Vercel needs raw body parsing for signature verification.

import Stripe from "stripe";
import { Resend } from "resend";

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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  // Read raw body
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", async () => {
    const raw = Buffer.concat(chunks).toString("utf8");
    const sig = (req.headers["stripe-signature"] as string) ?? "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        raw,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("[webhook] signature verification failed", err);
      return res.status(400).json({ error: "invalid_signature" });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      const slotId = session.metadata?.slot_id;

      if (!bookingId) {
        return res.status(200).json({ received: true }); // nothing to do
      }

      // Mark booking as paid
      await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}`,
        {
          method: "PATCH",
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          }),
        }
      );

      // Send confirmation email
      if (process.env.RESEND_API_KEY) {
        try {
          const bookingData = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/bookings?id=eq.${bookingId}&select=*,slot:slot_id(starts_at,ends_at)`,
            {
              headers: {
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
              },
            }
          ).then((r) => r.json());

          const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;
          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
            from: "Brick Engaged <bookings@resend.dev>",
            to: booking.caregiver_email,
            subject: "Booking confirmed — Brick Engaged",
            html: `
              <h1>Booking Confirmed!</h1>
              <p>Hi ${booking.caregiver_name},</p>
              <p>Your holiday session for <strong>${booking.child_name}</strong> is confirmed.</p>
              <p><strong>When:</strong> ${booking.slot?.starts_at ? new Date(booking.slot.starts_at).toLocaleDateString("en-NZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "See your booking"}</p>
              <p><strong>Time:</strong> 9am – 4pm</p>
              <p><strong>Location:</strong> Lane Park Business Centre, Upper Hutt</p>
              <p><strong>Booking reference:</strong> ${booking.id.slice(0, 8)}</p>
              <p>If you have any questions, contact Dan at 021 270 0301.</p>
              <p>See you there! 🧱</p>
            `,
          });
        } catch (emailErr) {
          console.error("[webhook] email send failed", emailErr);
          // Don't fail the webhook — booking is already paid
        }
      }
    }

    return res.status(200).json({ received: true });
  });
}
```

**Verification:** Use Stripe CLI to forward a test event: `stripe listen --forward-to localhost:4321/api/stripe/webhook`

---

### Task 4: Create `/book/confirmation/:bookingId` page

**Objective:** Landing page after Stripe redirect — shows confirmation details and next steps.

**Files:**
- Create: `artifacts/brick-engaged/src/pages/book/Confirmation.tsx`
- Modify: `artifacts/brick-engaged/src/App.tsx` (add route)

**Details:**

```tsx
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";

export default function Confirmation() {
  const [, params] = useRoute("/book/confirmation/:bookingId");
  const bookingId = params?.bookingId;

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-charcoal mb-3">
          Booking confirmed!
        </h1>
        <p className="text-slate-500 font-medium mb-2">
          Your payment was successful.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Reference: <span className="font-mono font-bold">{bookingId?.slice(0, 8)}</span>
        </p>
        <p className="text-slate-500 font-medium mb-8">
          A confirmation email is on its way. Check your inbox (and spam folder).
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/holiday">
            <LegoButton variant="orange">Back to Holidays</LegoButton>
          </Link>
          <Link href="/">
            <LegoButton variant="white">Home</LegoButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
```

**Route to add in App.tsx:**
```tsx
import Confirmation from "@/pages/book/Confirmation";
// ... inside <Switch>:
<Route path="/book/confirmation/:bookingId"><PageWrap><Confirmation /></PageWrap></Route>
```

---

### Task 5: Wire booking form into the Holiday page

**Objective:** When a user picks a date on the calendar, show a booking form below with child/caregiver fields + consent checkboxes.

**Files:**
- Create: `artifacts/brick-engaged/src/components/booking/BookingForm.tsx`
- Modify: `artifacts/brick-engaged/src/pages/Holiday.tsx` (add selected slot state + show form)

**BookingForm structure** (follows Contact.tsx pattern):

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LegoButton } from "@/components/LegoButton";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
  child_name: z.string().min(1, "Child's name is required"),
  child_age: z.coerce.number().min(3).max(99).optional().or(z.literal("")),
  caregiver_name: z.string().min(1, "Your name is required"),
  caregiver_email: z.string().email("Valid email required"),
  caregiver_phone: z.string().optional(),
  consent_medical: z.literal(true, { errorMap: () => ({ message: "You must consent to proceed" }) }),
  consent_photos: z.literal(true, { errorMap: () => ({ message: "You must consent to proceed" }) }),
  notes: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  slotId: string;
  date: string;
  priceCents: number;
  onComplete: (url: string) => void;
}

export function BookingForm({ slotId, date, priceCents, onComplete }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      child_name: "",
      child_age: "" as any,
      caregiver_name: "",
      caregiver_email: "",
      caregiver_phone: "",
      notes: "",
    },
  });

  async function onSubmit(values: BookingValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slotId,
          child_name: values.child_name,
          child_age: values.child_age ? Number(values.child_age) : null,
          caregiver_name: values.caregiver_name,
          caregiver_email: values.caregiver_email,
          caregiver_phone: values.caregiver_phone ?? "",
          consent: {
            medical: true,
            photos: true,
          },
          notes: values.notes ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "slot_full") {
          setError("Sorry, this day just filled up. Try another date.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      onComplete(data.url);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        <p className="text-lg font-black text-charcoal">
          Booking for <span className="text-lego-orange">{date}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="child_name" render={({ field }) => (
            <FormItem>
              <FormLabel>Child's name *</FormLabel>
              <FormControl><Input placeholder="e.g. Jamie" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="child_age" render={({ field }) => (
            <FormItem>
              <FormLabel>Child's age</FormLabel>
              <FormControl><Input type="number" placeholder="e.g. 8" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="caregiver_name" render={({ field }) => (
          <FormItem>
            <FormLabel>Your name *</FormLabel>
            <FormControl><Input placeholder="e.g. Alex" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="caregiver_email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="caregiver_phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="021 123 4567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (medical, dietary, anything Dan should know)</FormLabel>
            <FormControl>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                placeholder="Optional..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="space-y-3 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-charcoal">Consent</p>
          <FormField control={form.control} name="consent_medical" render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0">
              <FormControl>
                <input type="checkbox" checked={field.value || false} onChange={field.onChange} className="mt-1 h-4 w-4 rounded border-slate-300" />
              </FormControl>
              <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                I consent to Brick Engaged being notified of any medical conditions relevant to my child's participation
              </FormLabel>
            </FormItem>
          )} />
          <FormField control={form.control} name="consent_photos" render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0">
              <FormControl>
                <input type="checkbox" checked={field.value || false} onChange={field.onChange} className="mt-1 h-4 w-4 rounded border-slate-300" />
              </FormControl>
              <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                I consent to photos being taken of my child during the session for promotional purposes
              </FormLabel>
            </FormItem>
          )} />
          <FormMessage />
        </div>

        <LegoButton
          type="submit"
          variant="orange"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processing...</span>
          ) : (
            `Pay $${(priceCents / 100).toFixed(0)} to confirm`
          )}
        </LegoButton>
      </form>
    </Form>
  );
}
```

**Holiday.tsx changes:**
- Add `useState` for `selectedSlot: AvailabilitySlot | null`
- Pass `onSelect` to `<CalendarGrid>` that sets `selectedSlot`
- Below the calendar, conditionally render `<BookingForm>` when a slot is selected
- BookingForm's `onComplete` redirects to the Stripe Checkout URL: `window.location.href = url`

---

### Task 6: Add env vars to Vercel + deploy

**Objective:** Set the new Stripe + Resend keys and ship Phase 2.

```sh
cd /Users/jordantuhura/Desktop/Sidekick/Clients/Brick\ Engaged/brick-engaged-website

vercel env add STRIPE_SECRET_KEY production
# paste: sk_test_...

vercel env add STRIPE_PUBLISHABLE_KEY production
# paste: pk_test_...

vercel env add RESEND_API_KEY production
# paste: re_...

vercel env add STRIPE_WEBHOOK_SECRET production
# paste: whsec_... (get from Stripe Dashboard → Webhooks after creating the endpoint)

vercel env add BASE_URL production
# paste: https://brick-engaged-website.vercel.app

vercel --prod
```

**Also add these in the Supabase SQL editor:**
```sql
-- New RPC needed for the hold endpoint
create or replace function public.get_programme_for_slot(p_slot_id uuid)
returns table (price_cents integer, title text)
language sql
stable
security definer
set search_path = public
as $$
  select p.price_cents, p.title
  from public.slots s
  join public.programmes p on p.id = s.programme_id
  where s.id = p_slot_id;
$$;
```

---

### Task 7: Set up Stripe webhook endpoint

**Objective:** After deploying, configure Stripe to send events to your endpoint.

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://brick-engaged-website.vercel.app/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the **Signing secret** (`whsec_...`) → add as `STRIPE_WEBHOOK_SECRET` in Vercel
5. Redeploy: `vercel --prod`

**Verify:** Run a test Stripe checkout with card `4242 4242 4242 4242`, any future date, any CVC. The webhook should fire, booking should flip to `paid`, and you should receive a confirmation email.

---

### Task 8: Update the Supabase migration SQL

**Objective:** Keep the migration file in sync so future setups include the new RPC.

**Files:**
- Modify: `supabase/migrations/0001_init.sql` (append the `get_programme_for_slot` function before the seed section)

---

## Phase 2 verification checklist

- [ ] `/api/bookings/hold` returns 201 with a Stripe Checkout URL when called with valid data
- [ ] `/api/bookings/hold` returns 409 when the slot is full
- [ ] Stripe Checkout page loads with the correct price in NZD
- [ ] Successful payment redirects to `/book/confirmation/:id`
- [ ] Stripe webhook fires `checkout.session.completed` → booking status flips to `paid`
- [ ] Confirmation email arrives at the caregiver's address
- [ ] Calendar on `/holiday` updates to show reduced remaining spots (or "Full") after a booking
- [ ] Booking with `4242 4242 4242 4242` test card completes end-to-end

---

## Later phases (not in scope here)

| Phase | Scope |
|---|---|
| **3** | Admin login (Supabase magic link) + slot editor |
| **4** | Admin bookings table + CSV export + manual mark-paid |
| **5** | Term enrolments (Brick Club, Home schoolers) |
| **6** | Therapeutic 1:1 with donation field |
| **7** | Polish (.ics attachment, reminder emails, waitlist, privacy policy) |
| **8** | Hardening (rate limiting, Sentry, replace Google Form CTAs) |
