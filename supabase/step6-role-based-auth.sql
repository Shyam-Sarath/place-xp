-- ============================================================
-- STEP 6 SCHEMA UPDATE
-- Paste into Supabase SQL Editor and click Run.
--
-- Supports the new Participant vs Admin sign-up flow. The auth
-- forms now send an intended "role" in the sign-up metadata;
-- this replaces handle_new_user() so it actually stores it
-- (previously every new profile silently defaulted to 'student').
--
-- Safe to re-run — CREATE OR REPLACE just swaps the function body.
-- Anything other than 'student' / 'organizer' / 'admin' quietly
-- falls back to 'student', so this can't be used to smuggle in an
-- invalid role even if the client is tampered with.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'student');
begin
  if new.email !~* '@vitstudent\.ac\.in$' then
    raise exception 'Only VIT student email addresses (@vitstudent.ac.in) can sign up.';
  end if;

  if requested_role not in ('student', 'organizer', 'admin') then
    requested_role := 'student';
  end if;

  insert into public.profiles (id, full_name, reg_no, department, year, section, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'reg_no',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'phone',
    requested_role
  );
  return new;
end;
$$ language plpgsql security definer;
