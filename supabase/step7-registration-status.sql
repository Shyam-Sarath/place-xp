-- ============================================================
-- STEP 7 SCHEMA UPDATE
-- Paste into Supabase SQL Editor and click Run.
--
-- Adds Payment / Attendance / Approval status to registrations,
-- needed by the new admin Registrations page. Purely additive —
-- every existing row gets sensible defaults, nothing already in
-- the app changes behaviour.
--
-- Safe to re-run.
-- ============================================================

alter table public.registrations
  add column if not exists payment_status text not null default 'not_required'
    check (payment_status in ('not_required', 'pending', 'paid', 'waived'));

alter table public.registrations
  add column if not exists attendance_status text not null default 'registered'
    check (attendance_status in ('registered', 'attended', 'no_show'));

alter table public.registrations
  add column if not exists approval_status text not null default 'approved'
    check (approval_status in ('pending', 'approved', 'rejected'));

-- Re-asserted defensively in case is_staff() drifted from this
-- definition during earlier manual edits — see step8 for the RLS
-- policies that depend on it.
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('organizer', 'admin')
  );
$$;

-- Stops a participant's own INSERT from setting themselves as paid /
-- attended / pre-approved. Staff (the admin Registrations page) are
-- unaffected since they go through their own update, not this insert
-- path.
create or replace function public.enforce_registration_defaults()
returns trigger as $$
begin
  if not public.is_staff() then
    new.payment_status := 'not_required';
    new.attendance_status := 'registered';
    new.approval_status := 'approved';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists registrations_enforce_defaults on public.registrations;
create trigger registrations_enforce_defaults
  before insert on public.registrations
  for each row execute function public.enforce_registration_defaults();
