-- ============================================================
-- STEP 9 SCHEMA UPDATE
-- Paste into Supabase SQL Editor and click Run.
--
-- profiles has never stored email — every page that needed it
-- either skipped it or relied on registrations.email (only set for
-- users who've registered for at least one event). The new admin
-- Participants page needs to show every participant's email, so
-- this adds the column, backfills it once from auth.users, and
-- updates handle_new_user() to keep it filled in going forward.
--
-- Safe to re-run.
-- ============================================================

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.email !~* '@vitstudent\.ac\.in$' then
    raise exception 'Only VIT student email addresses (@vitstudent.ac.in) can sign up.';
  end if;

  insert into public.profiles (id, full_name, email, reg_no, department, year, section, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'reg_no',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;
