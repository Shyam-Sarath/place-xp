-- ============================================================
-- STEP 5 SCHEMA UPDATE
-- Paste into Supabase SQL Editor and click Run.
-- Adds Publish/Unpublish and Archive support to events.
-- ============================================================

alter table public.events add column published boolean not null default true;
alter table public.events add column archived boolean not null default false;

-- Replace the old "everyone can see every event" policy with one that
-- hides unpublished/archived events from the public, but staff can still
-- see everything (so the admin panel can manage drafts/archived events).
drop policy if exists "public read events" on public.events;

create policy "public read published events" on public.events
  for select using ((published = true and archived = false) or public.is_staff());
