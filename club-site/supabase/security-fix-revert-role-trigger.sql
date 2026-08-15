-- ============================================================
-- SECURITY FIX — run this immediately, before anything else.
--
-- step6-role-based-auth.sql changed handle_new_user() to read a
-- "role" field out of the sign-up request and store it directly.
-- That field is sent from the browser, which means anyone could
-- set it to 'admin' themselves (e.g. by picking the Admin tab on
-- the sign-up form) and get real admin access with no approval
-- step at all. This undoes that: every new sign-up is forced to
-- 'student' again, no matter what the client sends. The only way
-- to grant admin/organizer access is still you, by hand, in the
-- profiles table.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.email !~* '@vitstudent\.ac\.in$' then
    raise exception 'Only VIT student email addresses (@vitstudent.ac.in) can sign up.';
  end if;

  insert into public.profiles (id, full_name, reg_no, department, year, section, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'reg_no',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;
