-- Multi-day booking — book_slots() RPC
--
-- Locks every requested slot in deterministic UUID order (deadlock-safe),
-- checks capacity per slot, inserts a pending booking per slot — all in one
-- transaction. Returns the array of new booking IDs.
--
-- If ANY slot is full or unavailable, the whole transaction rolls back and
-- no rows are inserted. The exception message includes the offending slot
-- id so the API can surface a useful error.

create or replace function public.book_slots(
  p_slot_ids         uuid[],
  p_child_name       text,
  p_child_age        integer,
  p_caregiver_name   text,
  p_caregiver_email  text,
  p_caregiver_phone  text,
  p_consent          jsonb,
  p_notes            text
) returns uuid[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot_id       uuid;
  v_booking_id    uuid;
  v_booking_ids   uuid[] := '{}';
  v_programme_id  uuid;
  v_capacity      integer;
  v_taken         integer;
  v_amount_cents  integer;
begin
  if p_slot_ids is null or array_length(p_slot_ids, 1) is null then
    raise exception 'no_slots' using errcode = 'P0001';
  end if;

  -- Lock slots in a deterministic order so concurrent multi-day bookings
  -- can't deadlock on overlapping slot sets.
  for v_slot_id in select unnest(p_slot_ids) order by 1 loop
    select s.programme_id,
           coalesce(s.capacity_override, p.default_capacity),
           p.price_cents
      into v_programme_id, v_capacity, v_amount_cents
    from public.slots s
    join public.programmes p on p.id = s.programme_id
    where s.id = v_slot_id
      and s.status = 'open'
      and p.active = true
    for update of s;

    if v_programme_id is null then
      raise exception 'slot_unavailable:%', v_slot_id using errcode = 'P0001';
    end if;

    select count(*)
      into v_taken
    from public.bookings b
    where b.slot_id = v_slot_id
      and (
        b.status = 'paid'
        or (b.status = 'pending' and b.created_at > now() - interval '10 minutes')
      );

    if v_taken >= v_capacity then
      raise exception 'slot_full:%', v_slot_id using errcode = 'P0001';
    end if;

    insert into public.bookings (
      slot_id, programme_id, child_name, child_age,
      caregiver_name, caregiver_email, caregiver_phone,
      consent, notes, amount_cents, status
    ) values (
      v_slot_id, v_programme_id, p_child_name, p_child_age,
      p_caregiver_name, p_caregiver_email, p_caregiver_phone,
      coalesce(p_consent, '{}'::jsonb), p_notes, v_amount_cents, 'pending'
    )
    returning id into v_booking_id;

    v_booking_ids := v_booking_ids || v_booking_id;
  end loop;

  return v_booking_ids;
end;
$$;
