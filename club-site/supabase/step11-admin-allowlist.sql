-- ============================================================
-- STEP 11 — ADMIN ALLOWLIST
-- Paste into Supabase SQL Editor and click Run.
--
-- Replaces "sign up, then get manually promoted" with a
-- pre-approval list. Add an email here (section 2 below) — before
-- or after that person signs up — and their profile ends up with
-- role = 'admin' automatically. No more disabling triggers by hand
-- to fix a wiped database.
--
-- To onboard a new admin later, you only ever need to re-run:
--   insert into public.admin_allowlist (email) values ('someone@vitstudent.ac.in')
--   on conflict (email) do nothing;
-- (then re-run section 4 below if they already have an account)
--
-- Safe to re-run.
-- ============================================================

-- 1. The list itself. Not reachable from the app or API at all — RLS
--    is on with zero policies attached, so only the SQL Editor /
--    dashboard (which connects as the database owner and bypasses
--    RLS) can read or write it.
create table if not exists public.admin_allowlist (
  email       text primary key,
  added_at    timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

-- 2. Add yourself (and anyone else pre-approved for admin) here.
insert into public.admin_allowlist (email) values
  ('amitesh.ram2024@vitstudent.ac.in')
on conflict (email) do nothing;

-- 3. Signup trigger: check the list, then decide the starting role.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  initial_role text := 'student';
begin
  if new.email !~* '@vitstudent\.ac\.in$' then
    raise exception 'Only VIT student email addresses (@vitstudent.ac.in) can sign up.';
  end if;

  if exists (select 1 from public.admin_allowlist where email = new.email) then
    initial_role := 'admin';
  end if;

  insert into public.profiles (id, full_name, email, reg_no, department, year, section, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'reg_no',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'phone',
    initial_role
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. One-time catch-up: promote anyone who ALREADY has a profile row
--    but is on the list (covers people who signed up before their
--    email was added, e.g. you, right now). No-op if nobody matches.
do $$
begin
  if exists (
    select 1 from pg_trigger
    where tgname = 'profiles_prevent_role_escalation'
      and tgrelid = 'public.profiles'::regclass
  ) then
    execute 'alter table public.profiles disable trigger profiles_prevent_role_escalation';
  end if;
end $$;

update public.profiles p
set role = 'admin'
from public.admin_allowlist a
where p.email = a.email and p.role <> 'admin';

do $$
begin
  if exists (
    select 1 from pg_trigger
    where tgname = 'profiles_prevent_role_escalation'
      and tgrelid = 'public.profiles'::regclass
  ) then
    execute 'alter table public.profiles enable trigger profiles_prevent_role_escalation';
  end if;
end $$;

-- 5. Confirm.
select email, added_at from public.admin_allowlist order by added_at;
select full_name, email, role from public.profiles where role in ('admin', 'organizer');
