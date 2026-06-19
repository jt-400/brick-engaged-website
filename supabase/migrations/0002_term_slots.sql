-- Seed term slots for Brick Club + Home schoolers.
--
-- Each programme gets ONE slot per term — the slot represents the full
-- 10-week block, not an individual weekly session. The booking flow reserves
-- a seat for the term; the actual weekly day/time is communicated in the
-- confirmation email and on the programme page.
--
-- T3 2026: 28 July (Tue) – 29 September (Tue). 10 weekly sessions.
-- Adjust dates by editing the `starts_at` / `ends_at` values below.

insert into public.slots (programme_id, starts_at, ends_at, notes)
select p.id,
       '2026-07-28T16:00:00+12:00'::timestamptz,
       '2026-09-29T17:30:00+12:00'::timestamptz,
       'T3 2026 · weekly Tuesdays 4:00–5:30pm'
from public.programmes p
where p.slug = 'brick-club'
on conflict (programme_id, starts_at) do nothing;

insert into public.slots (programme_id, starts_at, ends_at, notes)
select p.id,
       '2026-07-30T10:00:00+12:00'::timestamptz,
       '2026-10-01T12:30:00+12:00'::timestamptz,
       'T3 2026 · weekly Thursdays 10:00am–12:30pm'
from public.programmes p
where p.slug = 'home-schoolers'
on conflict (programme_id, starts_at) do nothing;

-- Quick sanity check — should show one slot per term programme
select p.slug, count(*) as term_slots
from public.slots s
join public.programmes p on p.id = s.programme_id
where p.type = 'term'
group by p.slug
order by p.slug;
