-- ============================================================
-- STEP 8 SCHEMA UPDATE
-- Paste into Supabase SQL Editor and click Run.
--
-- Re-asserts every RLS policy the app depends on, in one place.
-- Run this after step7. It doesn't matter what your policies
-- currently look like — every one below is dropped first, so this
-- always leaves the database in a known-correct state:
--
--   Participants can access: their own profile, their own
--   registrations, published events, and the detail data (timeline,
--   announcements, resources, meeting links, faqs, organizers) for
--   events they're registered for.
--
--   Staff (role = 'organizer' or 'admin') can access everything.
--
-- Safe to re-run.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_timeline enable row level security;
alter table public.registrations enable row level security;
alter table public.announcements enable row level security;
alter table public.resources enable row level security;
alter table public.meeting_links enable row level security;
alter table public.faqs enable row level security;
alter table public.event_organizers enable row level security;

-- ---- profiles ----
drop policy if exists "profiles select own or staff" on public.profiles;
create policy "profiles select own or staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (id = auth.uid() or public.is_staff());

-- ---- events ----
drop policy if exists "public read events" on public.events;
drop policy if exists "public read published events" on public.events;
create policy "public read published events" on public.events
  for select using ((published = true and archived = false) or public.is_staff());

drop policy if exists "staff write events" on public.events;
create policy "staff write events" on public.events
  for all using (public.is_staff()) with check (public.is_staff());

-- ---- per-event detail tables ----
do $$
declare
  t text;
begin
  foreach t in array array['event_timeline','announcements','resources','meeting_links','faqs','event_organizers']
  loop
    execute format('drop policy if exists "read if staff or registered" on public.%I', t);
    execute format($f$
      create policy "read if staff or registered" on public.%I
        for select using (
          public.is_staff()
          or exists (
            select 1 from public.registrations r
            where r.event_id = %I.event_id and r.user_id = auth.uid()
          )
        )
    $f$, t, t);

    execute format('drop policy if exists "staff write" on public.%I', t);
    execute format('create policy "staff write" on public.%I for all using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- ---- registrations ----
drop policy if exists "registrations select own or staff" on public.registrations;
create policy "registrations select own or staff" on public.registrations
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "registrations insert own" on public.registrations;
create policy "registrations insert own" on public.registrations
  for insert with check (user_id = auth.uid() or public.is_staff());

drop policy if exists "registrations staff update" on public.registrations;
create policy "registrations staff update" on public.registrations
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "registrations staff delete" on public.registrations;
create policy "registrations staff delete" on public.registrations
  for delete using (public.is_staff());

-- ---- storage (event banners + resource files) ----
insert into storage.buckets (id, name, public)
values ('event-banners', 'event-banners', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('event-resources', 'event-resources', true)
on conflict (id) do nothing;

drop policy if exists "public read event-banners" on storage.objects;
create policy "public read event-banners" on storage.objects
  for select using (bucket_id = 'event-banners');

drop policy if exists "staff write event-banners" on storage.objects;
create policy "staff write event-banners" on storage.objects
  for all using (bucket_id = 'event-banners' and public.is_staff())
  with check (bucket_id = 'event-banners' and public.is_staff());

drop policy if exists "public read event-resources" on storage.objects;
create policy "public read event-resources" on storage.objects
  for select using (bucket_id = 'event-resources');

drop policy if exists "staff write event-resources" on storage.objects;
create policy "staff write event-resources" on storage.objects
  for all using (bucket_id = 'event-resources' and public.is_staff())
  with check (bucket_id = 'event-resources' and public.is_staff());
