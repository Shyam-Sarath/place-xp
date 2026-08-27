-- Event status selection and recruitment slot booking
alter table public.events add column if not exists slot_booking_enabled boolean not null default false;
alter table public.events add column if not exists meeting_link text;
alter table public.events add column if not exists whatsapp_link text;
alter table public.events add column if not exists instructions text;

create table if not exists public.event_slots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  booked_by uuid references public.profiles(id) on delete set null,
  booked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(event_id, slot_date, start_time, end_time)
);
alter table public.event_slots alter column event_id drop not null;
create table if not exists public.slot_booking_settings (
  id text primary key default 'slot_booking',
  title text not null default 'Recruitment Slot Booking',
  deadline timestamptz,
  meeting_link text,
  whatsapp_link text,
  instructions text,
  updated_at timestamptz not null default now()
);
insert into public.slot_booking_settings (id) values ('slot_booking') on conflict (id) do nothing;
alter table public.slot_booking_settings enable row level security;
drop policy if exists "public read slot settings" on public.slot_booking_settings;
create policy "public read slot settings" on public.slot_booking_settings for select using (true);
drop policy if exists "staff manage slot settings" on public.slot_booking_settings;
create policy "staff manage slot settings" on public.slot_booking_settings for all using (public.is_staff()) with check (public.is_staff());
create index if not exists event_slots_event_idx on public.event_slots(event_id);
alter table public.event_slots enable row level security;
drop policy if exists "read slots" on public.event_slots;
create policy "read slots" on public.event_slots for select using (auth.uid() is not null or true);
drop policy if exists "staff manage slots" on public.event_slots;
create policy "staff manage slots" on public.event_slots for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists "participant book slot" on public.event_slots;
create policy "participant book slot" on public.event_slots for update using (booked_by is null and auth.uid() is not null) with check (booked_by = auth.uid());

create or replace function public.book_event_slot(p_slot_id uuid)
returns public.event_slots
security definer
set search_path = public
language plpgsql
as $func$
declare result public.event_slots;
begin
  if auth.uid() is null then raise exception 'You must be logged in.'; end if;
  if exists (select 1 from event_slots mine join event_slots target on target.event_id is not distinct from mine.event_id where target.id=p_slot_id and mine.booked_by=auth.uid()) then
    raise exception 'You have already booked a slot for this event.';
  end if;
  update event_slots set booked_by=auth.uid(), booked_at=now() where id=p_slot_id and booked_by is null returning * into result;
  if result.id is null then raise exception 'This slot has already been booked. Please choose another available slot.'; end if;
  return result;
end;
$func$;
