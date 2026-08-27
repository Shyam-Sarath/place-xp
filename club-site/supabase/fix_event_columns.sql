-- Run this once in Supabase SQL Editor for an existing project.
alter table public.events add column if not exists slot_booking_enabled boolean not null default false;
alter table public.events add column if not exists meeting_link text;
alter table public.events add column if not exists whatsapp_link text;
alter table public.events add column if not exists instructions text;

-- Ask PostgREST to reload its schema cache immediately.
notify pgrst, 'reload schema';
