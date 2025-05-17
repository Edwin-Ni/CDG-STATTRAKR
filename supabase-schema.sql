-- This SQL can be run in the Supabase SQL editor to set up the required tables

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.actions enable row level security;
alter table public.reset_history enable row level security;

-- Create Users Table
create table public.users (
  id uuid primary key default auth.uid(),
  username text not null unique,
  total_points integer not null default 0,
  action_count integer not null default 0,
  created_at timestamp with time zone default now() not null
);

-- Create Actions Table
create table public.actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  username text not null,
  type text not null,
  points integer not null,
  description text,
  created_at timestamp with time zone default now() not null
);

-- Create Reset History Table
create table public.reset_history (
  id uuid primary key default gen_random_uuid(),
  reset_date timestamp with time zone not null,
  created_at timestamp with time zone default now() not null
);

-- Create function to increment user stats when an action is created
create or replace function increment_user_stats(p_user_id uuid, p_points integer)
returns void
language plpgsql
security definer
as $$
begin
  update public.users
  set 
    total_points = total_points + p_points,
    action_count = action_count + 1
  where id = p_user_id;
end;
$$;

-- Create function to reset monthly stats
create or replace function reset_monthly_stats()
returns void
language plpgsql
security definer
as $$
begin
  -- Reset all users' stats to 0 for new month
  update public.users
  set 
    total_points = 0,
    action_count = 0;
end;
$$;

-- RLS Policies

-- Users table policies
create policy "Public users are viewable by everyone"
  on public.users
  for select
  using (true);

create policy "Users can insert their own record"
  on public.users
  for insert
  with check (auth.uid() = id);

create policy "Users can update own record"
  on public.users
  for update
  using (auth.uid() = id);

-- Actions table policies
create policy "Actions are viewable by everyone"
  on public.actions
  for select
  using (true);

create policy "Users can insert their own actions"
  on public.actions
  for insert
  with check (auth.uid() = user_id);

-- Reset history policies
create policy "Reset history is viewable by everyone"
  on public.reset_history
  for select
  using (true);

-- Enable Supabase Auth hooks to create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username)
  values (new.id, new.email);
  return new;
end;
$$;

-- Create trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 