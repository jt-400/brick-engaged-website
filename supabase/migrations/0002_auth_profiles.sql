-- Brick Engaged — Auth & profiles (Phase 3/4)
-- Run this in the Supabase SQL editor after enabling Auth in the dashboard.
-- Idempotent — safe to re-run.

-- ─────────────────────────────────────────────────────────────────────────────
-- Profiles — one row per auth user, created on signup via trigger
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  caregiver_name    text,
  caregiver_phone   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, caregiver_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'caregiver_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Children — linked to a profile; reusable across bookings
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.children (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  age           integer,
  created_at    timestamptz not null default now()
);

create index if not exists children_profile_idx on public.children (profile_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Link bookings to profiles (caregiver_email → profile)
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists profile_id uuid references public.profiles(id);

create index if not exists bookings_profile_idx on public.bookings (profile_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS: profiles are own-data only
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.children enable row level security;

drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own"
  on public.profiles
  for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "children_own" on public.children;
create policy "children_own"
  on public.children
  for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Allow admins to read all profiles/children
drop policy if exists "admins_read_profiles" on public.profiles;
create policy "admins_read_profiles"
  on public.profiles
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.email()));

drop policy if exists "admins_read_children" on public.children;
create policy "admins_read_children"
  on public.children
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.email = auth.email()));

-- Add bookings RLS for the booking owner
drop policy if exists "bookings_own" on public.bookings;
create policy "bookings_own"
  on public.bookings
  for select
  to authenticated
  using (profile_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: get_or_create_profile — called after booking to link auth user
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_or_create_profile(p_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_profile_id uuid;
begin
  -- Find the auth user by email
  select id into v_user_id
  from auth.users
  where email = p_email;

  if v_user_id is null then
    return null;  -- No auth user yet (booked before signing up)
  end if;

  -- Find or create profile
  select id into v_profile_id
  from public.profiles
  where id = v_user_id;

  if v_profile_id is null then
    insert into public.profiles (id, email)
    values (v_user_id, p_email)
    returning id into v_profile_id;
  end if;

  return v_profile_id;
end;
$$;
