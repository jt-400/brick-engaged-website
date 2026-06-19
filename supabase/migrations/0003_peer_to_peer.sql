-- Peer-to-peer programmes + 12 weeks of weekly slots.
--
-- We split into 3 programmes (one per night) so each group has its own
-- availability and we can close/open them independently in the future.
--
-- Pricing is $0 — koha is paid in person, so the booking flow uses the
-- "$0 fast path" in /api/bookings/hold (no Stripe redirect, mark paid,
-- send confirmation email).
--
-- Group nights (all 6:30 – 8:30pm):
--   Monday    · Men's Group
--   Tuesday   · Couples Group
--   Wednesday · Women's Group

-- ─────────────────────────────────────────────────────────────────────────────
-- Programmes
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.programmes (slug, type, title, description, price_cents, default_capacity, location)
values
  ('peer-to-peer-mens', 'therapeutic',
   'Peer-to-Peer · Men''s Group',
   'Monday evening drop-in mindful-building session for men. Casual, confidential, social if you want it to be.',
   0, 10, 'Lane Park Business Centre, Upper Hutt'),
  ('peer-to-peer-couples', 'therapeutic',
   'Peer-to-Peer · Couples Group',
   'Tuesday evening drop-in mindful-building session for couples. Casual, confidential, social if you want it to be.',
   0, 10, 'Lane Park Business Centre, Upper Hutt'),
  ('peer-to-peer-womens', 'therapeutic',
   'Peer-to-Peer · Women''s Group',
   'Wednesday evening drop-in mindful-building session for women. Casual, confidential, social if you want it to be.',
   0, 10, 'Lane Park Business Centre, Upper Hutt')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- The legacy `therapeutic` programme is now superseded by the 3 peer-to-peer
-- groups. Mark it inactive so /api/availability won't return its slots,
-- but keep the row for historical bookings.
-- ─────────────────────────────────────────────────────────────────────────────
update public.programmes set active = false where slug = 'therapeutic';

-- ─────────────────────────────────────────────────────────────────────────────
-- Slot generator helper — emits 12 weekly slots starting from the next
-- occurrence of the given ISO weekday (1=Mon, 2=Tue, 3=Wed, …).
-- ─────────────────────────────────────────────────────────────────────────────

-- Monday Men's — 12 weeks from next Monday, 18:30 NZ time
insert into public.slots (programme_id, starts_at, ends_at, notes)
select
  p.id,
  ((current_date + ((1 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '18:30')
    at time zone 'Pacific/Auckland',
  ((current_date + ((1 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '20:30')
    at time zone 'Pacific/Auckland',
  'Men''s Group · Mon 6:30–8:30pm'
from public.programmes p
cross join generate_series(0, 11) as w
where p.slug = 'peer-to-peer-mens'
on conflict (programme_id, starts_at) do nothing;

-- Tuesday Couples — 12 weeks from next Tuesday
insert into public.slots (programme_id, starts_at, ends_at, notes)
select
  p.id,
  ((current_date + ((2 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '18:30')
    at time zone 'Pacific/Auckland',
  ((current_date + ((2 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '20:30')
    at time zone 'Pacific/Auckland',
  'Couples Group · Tue 6:30–8:30pm'
from public.programmes p
cross join generate_series(0, 11) as w
where p.slug = 'peer-to-peer-couples'
on conflict (programme_id, starts_at) do nothing;

-- Wednesday Women's — 12 weeks from next Wednesday
insert into public.slots (programme_id, starts_at, ends_at, notes)
select
  p.id,
  ((current_date + ((3 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '18:30')
    at time zone 'Pacific/Auckland',
  ((current_date + ((3 - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + time '20:30')
    at time zone 'Pacific/Auckland',
  'Women''s Group · Wed 6:30–8:30pm'
from public.programmes p
cross join generate_series(0, 11) as w
where p.slug = 'peer-to-peer-womens'
on conflict (programme_id, starts_at) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Sanity check
-- ─────────────────────────────────────────────────────────────────────────────
select p.slug, count(s.id) as slots, min(s.starts_at) as first_slot, max(s.starts_at) as last_slot
from public.programmes p
left join public.slots s on s.programme_id = p.id
where p.slug like 'peer-to-peer-%'
group by p.slug
order by p.slug;
