-- Brick Engaged booking system — initial schema (idempotent — safe to re-run).
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- programmes
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.programmes (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  type              text not null check (type in ('holiday', 'term', 'therapeutic')),
  title             text not null,
  description       text,
  price_cents       integer not null default 0,
  default_capacity  integer not null default 10,
  location          text,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- slots — one row per bookable date (or term)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.slots (
  id                  uuid primary key default gen_random_uuid(),
  programme_id        uuid not null references public.programmes(id) on delete cascade,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  capacity_override   integer,
  status              text not null default 'open' check (status in ('open', 'closed', 'full')),
  notes               text,
  created_at          timestamptz not null default now(),
  unique (programme_id, starts_at)
);

create index if not exists slots_programme_starts_idx on public.slots (programme_id, starts_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- bookings
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                      uuid primary key default gen_random_uuid(),
  slot_id                 uuid references public.slots(id) on delete set null,
  programme_id            uuid not null references public.programmes(id) on delete restrict,
  child_name              text not null,
  child_age               integer,
  caregiver_name          text not null,
  caregiver_email         text not null,
  caregiver_phone         text,
  consent                 jsonb not null default '{}'::jsonb,
  notes                   text,
  amount_cents            integer not null default 0,
  stripe_session_id       text,
  stripe_payment_intent   text,
  status                  text not null default 'pending'
                          check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  paid_at                 timestamptz,
  created_at              timestamptz not null default now()
);

create index if not exists bookings_slot_status_idx on public.bookings (slot_id, status);
create index if not exists bookings_programme_idx   on public.bookings (programme_id);
create index if not exists bookings_created_idx     on public.bookings (created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- admins allowlist — emails permitted to access /admin via Supabase magic link
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: availability_for(programme_slug, from_ts, to_ts)
-- Returns one row per open slot with remaining capacity.
-- Pending bookings older than 10 minutes are treated as expired (not counted).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.availability_for(
  p_slug    text,
  p_from    timestamptz,
  p_to      timestamptz
) returns table (
  slot_id       uuid,
  starts_at     timestamptz,
  ends_at       timestamptz,
  capacity      integer,
  remaining     integer,
  status        text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id                                                    as slot_id,
    s.starts_at,
    s.ends_at,
    coalesce(s.capacity_override, p.default_capacity)       as capacity,
    coalesce(s.capacity_override, p.default_capacity)
      - coalesce((
          select count(*)
          from public.bookings b
          where b.slot_id = s.id
            and (
              b.status = 'paid'
              or (b.status = 'pending' and b.created_at > now() - interval '10 minutes')
            )
        ), 0)                                               as remaining,
    s.status
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
-- Helper: book_slot(...) — atomic capacity check + booking insert.
-- Used by Phase 2's POST /api/bookings/hold. Returns the new booking id.
-- Raises an exception (caught by the API) when the slot is full.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.book_slot(
  p_slot_id          uuid,
  p_child_name       text,
  p_child_age        integer,
  p_caregiver_name   text,
  p_caregiver_email  text,
  p_caregiver_phone  text,
  p_consent          jsonb,
  p_notes            text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_programme_id  uuid;
  v_capacity      integer;
  v_taken         integer;
  v_amount_cents  integer;
  v_booking_id    uuid;
begin
  select s.programme_id,
         coalesce(s.capacity_override, p.default_capacity),
         p.price_cents
    into v_programme_id, v_capacity, v_amount_cents
  from public.slots s
  join public.programmes p on p.id = s.programme_id
  where s.id = p_slot_id
    and s.status = 'open'
    and p.active = true
  for update of s;

  if v_programme_id is null then
    raise exception 'slot_unavailable' using errcode = 'P0001';
  end if;

  select count(*)
    into v_taken
  from public.bookings b
  where b.slot_id = p_slot_id
    and (
      b.status = 'paid'
      or (b.status = 'pending' and b.created_at > now() - interval '10 minutes')
    );

  if v_taken >= v_capacity then
    raise exception 'slot_full' using errcode = 'P0001';
  end if;

  insert into public.bookings (
    slot_id, programme_id, child_name, child_age,
    caregiver_name, caregiver_email, caregiver_phone,
    consent, notes, amount_cents, status
  ) values (
    p_slot_id, v_programme_id, p_child_name, p_child_age,
    p_caregiver_name, p_caregiver_email, p_caregiver_phone,
    coalesce(p_consent, '{}'::jsonb), p_notes, v_amount_cents, 'pending'
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security — deny-by-default; explicit policies follow.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.programmes enable row level security;
alter table public.slots      enable row level security;
alter table public.bookings   enable row level security;
alter table public.admins     enable row level security;

drop policy if exists "programmes_public_read" on public.programmes;
create policy "programmes_public_read"
  on public.programmes
  for select
  using (active = true);

drop policy if exists "admins_read_programmes" on public.programmes;
create policy "admins_read_programmes"
  on public.programmes
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.email()));

drop policy if exists "admins_read_slots" on public.slots;
create policy "admins_read_slots"
  on public.slots
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.email()));

drop policy if exists "admins_read_bookings" on public.bookings;
create policy "admins_read_bookings"
  on public.bookings
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.email()));

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: the four programmes from the existing site copy
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.programmes (slug, type, title, description, price_cents, default_capacity, location)
values
  ('holiday',
   'holiday',
   'School Holiday Programme',
   'LEGO® Master Dan LMNZ S1. Small groups, meaningful interaction, fun, safe and inclusive.',
   11500, 10, 'Lane Park Business Centre, Upper Hutt'),
  ('brick-club',
   'term',
   'Brick Club',
   'Children build LEGO® models together, making friends and developing skills along the way.',
   29900, 10, 'Lane Park Business Centre, Upper Hutt'),
  ('home-schoolers',
   'term',
   'Home schoolers sessions',
   'Home school groups explore and learn by building and observing. Curriculum areas: Maths, Physics, Arts and Environment.',
   15000, 12, 'Lane Park Business Centre, Upper Hutt'),
  ('therapeutic',
   'therapeutic',
   'Therapeutic Use of LEGO®',
   'Mindful building tailored for teenagers and adults, with a focus on respite, mental health and peer-to-peer support.',
   1000, 10, 'Lane Park Business Centre, Upper Hutt')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: sample holiday slots — every weekday for the next 14 days from "today".
-- Easy to swap for the real holiday block via the admin UI in Phase 3.
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.slots (programme_id, starts_at, ends_at)
select
  p.id,
  (d::date + time '09:00') at time zone 'Pacific/Auckland',
  (d::date + time '16:00') at time zone 'Pacific/Auckland'
from public.programmes p
cross join generate_series(
  current_date,
  current_date + interval '14 days',
  interval '1 day'
) as d
where p.slug = 'holiday'
  and extract(isodow from d) < 6  -- Mon–Fri only
on conflict do nothing;
