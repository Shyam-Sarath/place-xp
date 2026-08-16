-- ============================================================
-- STEP 12 — GLOBAL ADMIN BOARDS + SITE SETTINGS
-- Paste into Supabase SQL Editor and click Run.
--
-- Adds the global admin task board and club-wide site settings
-- tables required by the admin dashboard pages.
--
-- Safe to re-run.
-- ============================================================

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events (id) on delete set null,
  title       text not null,
  description text,
  status      text not null default 'todo'
              check (status in ('todo', 'in_progress', 'done')),
  priority    text not null default 'medium'
              check (priority in ('low', 'medium', 'high')),
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists tasks_event_id_idx on public.tasks (event_id);
create index if not exists tasks_status_idx on public.tasks (status);

create table if not exists public.site_settings (
  id            text primary key default 'site_settings',
  site_name     text not null default 'Place XP',
  contact_email text,
  instagram_url text,
  linkedin_url  text,
  x_url         text,
  updated_at    timestamptz not null default now()
);

create or replace function public.touch_site_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_site_settings_updated_at();

alter table public.tasks enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "staff read tasks" on public.tasks;
create policy "staff read tasks" on public.tasks
  for select using (public.is_staff());

drop policy if exists "staff write tasks" on public.tasks;
create policy "staff write tasks" on public.tasks
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select using (true);

drop policy if exists "staff write site_settings" on public.site_settings;
create policy "staff write site_settings" on public.site_settings
  for all using (public.is_staff()) with check (public.is_staff());

insert into public.site_settings (id, site_name)
values ('site_settings', 'Place XP')
on conflict (id) do nothing;
