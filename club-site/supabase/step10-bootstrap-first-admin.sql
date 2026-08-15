-- ============================================================
-- STEP 10 — BOOTSTRAP YOUR FIRST ADMIN
-- Paste into Supabase SQL Editor and click Run.
--
-- Why you need this: schema.sql added a trigger
-- (profiles_prevent_role_escalation) that silently blocks any
-- UPDATE to profiles.role unless the person running it is already
-- staff. That's correct behaviour for the running app — but it also
-- means a plain "UPDATE profiles SET role = 'admin' ..." typed
-- into the SQL Editor does nothing, because the SQL Editor has no
-- logged-in user either. There has to be a way to create the very
-- first admin by hand, once. This is that script.
--
-- HOW TO USE
--  1. Run the two SELECTs below first, to see what's actually in
--     your database right now.
--  2. Replace YOUR_EMAIL_HERE with your VIT email further down.
--  3. Run the whole file.
--
-- Safe to re-run.
-- ============================================================

-- 1. Sanity check — see what actually exists right now.
select id, email, created_at from auth.users order by created_at desc;
select id, full_name, email, role, created_at from public.profiles order by created_at desc;

-- If the first query above returns ZERO rows, there is no account to
-- promote yet — go sign up normally in the app (Participant tab is
-- fine, role doesn't matter at signup anymore), THEN come back and
-- run the block below with that email.

-- 2. Promote (or create) your profile as admin.
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

insert into public.profiles (id, full_name, email, role)
select id, coalesce(raw_user_meta_data->>'full_name', 'Admin'), email, 'admin'
from auth.users
where email = 'YOUR_EMAIL_HERE@vitstudent.ac.in'
on conflict (id) do update set role = 'admin';

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

-- 3. Confirm it worked.
select id, full_name, email, role from public.profiles where email = 'YOUR_EMAIL_HERE@vitstudent.ac.in';
