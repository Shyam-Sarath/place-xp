-- Create a public storage bucket for presentations
insert into storage.buckets (id, name, public) 
values ('presentations', 'presentations', false);

-- Create the table to track submissions
create table public.event_submissions (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references auth.users(id) not null,
  file_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure it so users can only view and upload their own files
alter table public.event_submissions enable row level security;

create policy "Users can insert their own submissions" 
on public.event_submissions for insert 
with check (auth.uid() = user_id);

create policy "Users can view their own submissions" 
on public.event_submissions for select 
using (auth.uid() = user_id);

-- Storage policy for authenticated users to upload
create policy "Authenticated users can upload presentations"
on storage.objects for insert
with check ( bucket_id = 'presentations' AND auth.role() = 'authenticated' );