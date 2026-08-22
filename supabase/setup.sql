-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)
-- after creating your project. Paste the whole file and click "Run".

create table if not exists charlas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_url text,
  created_at timestamptz not null default now()
);

alter table charlas enable row level security;

create policy "Authenticated users can read charlas"
on charlas for select
to authenticated
using (true);
