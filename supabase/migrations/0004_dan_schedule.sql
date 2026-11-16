-- 21 June 2026 — Dan's actual schedule
--
-- 1. Adds one-to-one programme + new type enum value
-- 2. Extends availability_for() to return slot notes (used as labels in UI)
-- 3. Closes existing test slots for holiday / brick-club / home-schoolers
-- 4. Seeds real schedule:
--      Brick Club    — Mon (8, 7–11) · Tue (6, 12+) · Wed (5, 7+)
--      Home Schoolers— Mon 10am–12pm · Tue 1–3pm  (12 capacity each)
--      Holiday       — 6, 7, 8, 9, 13, 14, 15, 16 July 2026 (10 + 17 closed)
--      One-to-One    — 16 weekly slots (Mon×5 · Tue×4 · Wed×7), $45 / hour, 12 weeks ahead

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Programme type — add 'one-to-one' to the allowed set
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.programmes drop constraint if exists programmes_type_check;
alter table public.programmes add constraint programmes_type_check
  check (type in ('holiday', 'term', 'therapeutic', 'one-to-one'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. One-to-One programme row (idempotent)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.programmes (slug, type, title, description, price_cents, default_capacity, location)
values
  ('one-to-one', 'one-to-one', 'One-to-One Session',
   'One-hour booked LEGO® time with Dan. Build, chat, learn, or finish a project.',
   4500, 1, 'Lane Park Business Centre, Upper Hutt')
on conflict (slug) do update set
  type = excluded.type,
  title = excluded.title,
  description = excluded.description,
  price_cents = excluded.price_cents,
  default_capacity = excluded.default_capacity,
  location = excluded.location,
  active = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. availability_for — now also returns `notes` (slot label)
-- ─────────────────────────────────────────────────────────────────────────────
drop function if exists public.availability_for(text, timestamptz, timestamptz);
create or replace function public.availability_for(
  p_slug text,
  p_from timestamptz,
  p_to   timestamptz
) returns table (
  slot_id   uuid,
  starts_at timestamptz,
  ends_at   timestamptz,
  capacity  integer,
  remaining integer,
  status    text,
  notes     text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id as slot_id,
    s.starts_at,
    s.ends_at,
    coalesce(s.capacity_override, p.default_capacity) as capacity,
    coalesce(s.capacity_override, p.default_capacity)
      - coalesce((
          select count(*)
          from public.bookings b
          where b.slot_id = s.id
            and (
              b.status = 'paid'
              or (b.status = 'pending' and b.created_at > now() - interval '10 minutes')
            )
        ), 0) as remaining,
    s.status,
    s.notes
  from public.slots s
  join public.programmes p on p.id = s.programme_id
  where p.slug = p_slug
    and p.active = true
    and s.status <> 'closed'
    and s.starts_at >= p_from
    and s.starts_at <  p_to
  order by s.starts_at;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Close existing test/legacy slots so they stop showing in availability.
-- We don't delete — keeps any historical bookings traceable.
-- ─────────────────────────────────────────────────────────────────────────────
update public.slots
set status = 'closed'
where programme_id in (
  select id from public.programmes where slug in ('brick-club', 'home-schoolers', 'holiday')
)
and status <> 'closed';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Brick Club T3 2026 — 3 weekly groups
--    Mon 4–5:30pm  · cap 8  · 7–11 yrs
--    Tue 4–5:30pm  · cap 6  · 12+ yrs
--    Wed 5–6:30pm  · cap 5  · 7+  yrs
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.slots (programme_id, starts_at, ends_at, capacity_override, notes, status)
select p.id,
       '2026-07-27T16:00:00+12:00'::timestamptz,
       '2026-07-27T17:30:00+12:00'::timestamptz,
       8,
       'T3 2026 · Mondays 4:00–5:30pm · Most suited to 7–11 yrs',
       'open'
from public.programmes p where p.slug = 'brick-club'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  capacity_override = excluded.capacity_override,
  notes = excluded.notes;

insert into public.slots (programme_id, starts_at, ends_at, capacity_override, notes, status)
select p.id,
       '2026-07-28T16:00:00+12:00'::timestamptz,
       '2026-07-28T17:30:00+12:00'::timestamptz,
       6,
       'T3 2026 · Tuesdays 4:00–5:30pm · Most suited to 12+ yrs',
       'open'
from public.programmes p where p.slug = 'brick-club'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  capacity_override = excluded.capacity_override,
  notes = excluded.notes;

insert into public.slots (programme_id, starts_at, ends_at, capacity_override, notes, status)
select p.id,
       '2026-07-29T17:00:00+12:00'::timestamptz,
       '2026-07-29T18:30:00+12:00'::timestamptz,
       5,
       'T3 2026 · Wednesdays 5:00–6:30pm · Most suited to 7+ yrs',
       'open'
from public.programmes p where p.slug = 'brick-club'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  capacity_override = excluded.capacity_override,
  notes = excluded.notes;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Home Schoolers T3 2026 — Mon 10am–12pm · Tue 1–3pm
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.slots (programme_id, starts_at, ends_at, capacity_override, notes, status)
select p.id,
       '2026-07-27T10:00:00+12:00'::timestamptz,
       '2026-07-27T12:00:00+12:00'::timestamptz,
       12,
       'T3 2026 · Mondays 10:00am–12:00pm',
       'open'
from public.programmes p where p.slug = 'home-schoolers'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  capacity_override = excluded.capacity_override,
  notes = excluded.notes;

insert into public.slots (programme_id, starts_at, ends_at, capacity_override, notes, status)
select p.id,
       '2026-07-28T13:00:00+12:00'::timestamptz,
       '2026-07-28T15:00:00+12:00'::timestamptz,
       12,
       'T3 2026 · Tuesdays 1:00–3:00pm',
       'open'
from public.programmes p where p.slug = 'home-schoolers'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  capacity_override = excluded.capacity_override,
  notes = excluded.notes;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Holiday Programme — July 2026: 6, 7, 8, 9, 13, 14, 15, 16
--    (10 and 17 deliberately closed)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.slots (programme_id, starts_at, ends_at, notes, status)
select p.id,
       (d::date + time '09:00') at time zone 'Pacific/Auckland',
       (d::date + time '16:00') at time zone 'Pacific/Auckland',
       to_char(d::date, 'FMDay DD Mon · 9am–4pm'),
       'open'
from public.programmes p
cross join (values
  ('2026-07-06'::date),
  ('2026-07-07'::date),
  ('2026-07-08'::date),
  ('2026-07-09'::date),
  ('2026-07-13'::date),
  ('2026-07-14'::date),
  ('2026-07-15'::date),
  ('2026-07-16'::date)
) as h(d)
where p.slug = 'holiday'
on conflict (programme_id, starts_at) do update set
  status = 'open',
  ends_at = excluded.ends_at,
  notes = excluded.notes;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. One-to-One — 16 weekly time slots × 12 weeks ahead
--     Mon · 5 slots / Tue · 4 slots / Wed · 7 slots
--     ISO weekday: 1=Mon, 2=Tue, 3=Wed
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.slots (programme_id, starts_at, ends_at, notes, status)
select
  p.id,
  ((current_date + ((sched.dow - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + sched.start_at) at time zone 'Pacific/Auckland',
  ((current_date + ((sched.dow - extract(isodow from current_date)::int + 7) % 7 + 7 * w)::int) + sched.end_at)   at time zone 'Pacific/Auckland',
  sched.label,
  'open'
from public.programmes p
cross join generate_series(0, 11) as w
cross join (values
  (1, '08:30'::time, '09:30'::time, 'Monday 8:30–9:30am'),
  (1, '12:15'::time, '13:15'::time, 'Monday 12:15–1:15pm'),
  (1, '13:30'::time, '14:30'::time, 'Monday 1:30–2:30pm'),
  (1, '14:45'::time, '15:45'::time, 'Monday 2:45–3:45pm'),
  (1, '17:30'::time, '18:30'::time, 'Monday 5:30–6:30pm'),
  (2, '09:00'::time, '10:00'::time, 'Tuesday 9:00–10:00am'),
  (2, '10:15'::time, '11:15'::time, 'Tuesday 10:15–11:15am'),
  (2, '11:30'::time, '12:30'::time, 'Tuesday 11:30am–12:30pm'),
  (2, '17:30'::time, '18:30'::time, 'Tuesday 5:30–6:30pm'),
  (3, '08:00'::time, '09:00'::time, 'Wednesday 8:00–9:00am'),
  (3, '09:15'::time, '10:15'::time, 'Wednesday 9:15–10:15am'),
  (3, '10:30'::time, '11:30'::time, 'Wednesday 10:30–11:30am'),
  (3, '12:00'::time, '13:00'::time, 'Wednesday 12:00–1:00pm'),
  (3, '13:15'::time, '14:15'::time, 'Wednesday 1:15–2:15pm'),
  (3, '14:30'::time, '15:30'::time, 'Wednesday 2:30–3:30pm'),
  (3, '15:45'::time, '16:45'::time, 'Wednesday 3:45–4:45pm')
) as sched(dow, start_at, end_at, label)
where p.slug = 'one-to-one'
on conflict (programme_id, starts_at) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Sanity check
-- ─────────────────────────────────────────────────────────────────────────────
select p.slug, p.active, p.price_cents,
       count(s.id) filter (where s.status = 'open' and s.starts_at >= now()) as open_future_slots,
       min(s.starts_at) filter (where s.status = 'open' and s.starts_at >= now()) as first_open,
       max(s.starts_at) filter (where s.status = 'open' and s.starts_at >= now()) as last_open
from public.programmes p
left join public.slots s on s.programme_id = p.id
where p.active = true
group by p.slug, p.active, p.price_cents
order by p.slug;
