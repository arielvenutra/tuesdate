-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

-- Create the places table
create table if not exists public.places (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  instagram_link text,
  note        text,
  status      text        not null default 'unvisited'
                          check (status in ('unvisited', 'selected', 'visited')),
  rating      smallint    check (rating >= 1 and rating <= 5),
  review      text,
  created_at  timestamptz not null default now(),
  visited_at  timestamptz
);

-- Enable Row Level Security
alter table public.places enable row level security;

-- Allow ALL operations for anonymous users (no auth needed — both phones share same data)
create policy "Allow full access to all users"
  on public.places
  for all
  using (true)
  with check (true);

-- Enable realtime so both phones stay in sync instantly
alter publication supabase_realtime add table public.places;
