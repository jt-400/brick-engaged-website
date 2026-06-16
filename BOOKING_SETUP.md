# Booking system — setup checklist

Phase 1 ships a read-only availability calendar on `/holiday`. To make it work
you need to (a) create a Supabase project, (b) run the migration, (c) tell
Vercel the credentials. ~15 minutes start-to-finish.

## 1. Create the Supabase project

1. Go to https://supabase.com → **New project**
2. Name: `brick-engaged-booking` (or whatever)
3. **Region: Southeast Asia (Singapore) or Australia (Sydney)** — Sydney is the closest to NZ. Important for the Privacy Act 2020.
4. Choose a strong DB password and save it in your password manager
5. Wait ~2 min for provisioning

## 2. Run the migration

1. In the Supabase dashboard sidebar, open **SQL editor → New query**
2. Open `supabase/migrations/0001_init.sql` from this repo
3. Paste the entire file into the SQL editor and click **Run**
4. You should see "Success. No rows returned." (the seed `insert`s are idempotent)
5. Verify by clicking **Table editor**: you'll see `programmes`, `slots`, `bookings`, `admins`, and the `holiday` programme will have ~10 weekday slots seeded for the next two weeks

## 3. Grab the API keys

In the Supabase dashboard, open **Project settings → API**. You need three values:

| Vercel env var | Supabase field |
|---|---|
| `SUPABASE_URL` | "Project URL" (e.g. `https://abcd1234.supabase.co`) |
| `SUPABASE_ANON_KEY` | "anon" / "public" key under "Project API keys" |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (keep secret — bypasses RLS) |

⚠️ **Never commit the service_role key.** It bypasses all row-level security.

## 4. Add the env vars to Vercel

```sh
# From the project root (where vercel.json lives)
vercel env add SUPABASE_URL                 production
vercel env add SUPABASE_ANON_KEY            production
vercel env add SUPABASE_SERVICE_ROLE_KEY    production

# Repeat for preview + development environments so local + PR previews work
vercel env add SUPABASE_URL                 preview
vercel env add SUPABASE_ANON_KEY            preview
vercel env add SUPABASE_SERVICE_ROLE_KEY    preview

vercel env add SUPABASE_URL                 development
vercel env add SUPABASE_ANON_KEY            development
vercel env add SUPABASE_SERVICE_ROLE_KEY    development
```

Each command pastes you into a prompt — paste the value, hit return.

## 5. Local dev (optional but recommended)

For local `pnpm dev` to hit the same database, create
`artifacts/brick-engaged/.env.local`:

```env
SUPABASE_URL=https://abcd1234.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Add `.env.local` to `.gitignore` if it's not already (it usually is).

To run the api/ functions locally you also need the Vercel CLI:

```sh
vercel dev
```

This proxies `/api/*` to the serverless functions and serves the Vite app at
http://localhost:3000.

## 6. Deploy

```sh
vercel --prod
```

Then visit `/holiday` on production — the new "See which days are open"
section should show a calendar with the seeded weekday slots, each marked "10
left" in lego-orange.

## Verify it works

- ✅ Calendar renders, weekdays in green, weekends greyed out
- ✅ "Next open: Mon 16 Jun · 10 left" pill appears in the footer
- ✅ Network tab: `/api/availability?programme=holiday` returns `200` with a `slots` array

## Troubleshooting

**Calendar shows "Couldn't load availability."**
- Open the browser network tab → look at `/api/availability` → check the response body
- Most likely: env vars not set, or migration not run. Check Supabase Table editor for the `holiday` programme row

**Calendar renders but all days are greyed out**
- The seed only generates weekday slots for the next 14 days. Run a top-up via:
  ```sql
  insert into public.slots (programme_id, starts_at, ends_at)
  select p.id,
         (d::date + time '09:00') at time zone 'Pacific/Auckland',
         (d::date + time '16:00') at time zone 'Pacific/Auckland'
  from public.programmes p
  cross join generate_series(current_date, current_date + interval '60 days', interval '1 day') as d
  where p.slug = 'holiday' and extract(isodow from d) < 6
  on conflict do nothing;
  ```

**TypeScript can't find `react-day-picker/style.css`**
- That's a CSS side-effect import — fine at runtime, ignore the type warning, or add an ambient declaration.

## What ships next (Phase 2)

Once you confirm the calendar works on production, Phase 2 adds:
- Stripe + Resend account setup
- `/book/holiday` page with the booking form
- Actual checkout flow with confirmation email

Don't create Stripe / Resend accounts yet — wait for the Phase 2 kickoff so we set up the webhooks correctly.
