-- Add tasks and site_settings tables (idempotent)

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
