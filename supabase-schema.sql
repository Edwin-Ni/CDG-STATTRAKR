-- This SQL can be run in the Supabase SQL editor to set up the required tables

-- Create Users Table
create table public.users (
  id uuid primary key default auth.uid(),
  username text unique not null,
  github_username text unique default null,
  total_xp integer not null default 0,
  monthly_xp integer not null default 0,
  level integer not null default 1,
  coins integer not null default 0,
  quest_count integer not null default 0,
  monthly_quest_count integer not null default 0,
  created_at timestamp with time zone default now() not null
);

-- Create Quests Table
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  username text not null,
  source text not null,
  type text not null,
  xp integer not null,
  description text,
  created_at timestamp with time zone default now() not null
);

-- Create Levels Table - Defines level requirements and rewards
create table public.levels (
  level integer primary key,
  xp_required integer not null,
  coin_reward integer not null default 0,
  title text,
  special_reward jsonb -- For future extensibility (items, unlocks, etc.)
);

create table public.level_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) not null,
  level integer references public.levels(level) not null,
  xp integer not null,
  claimed boolean not null default false,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.quests enable row level security;
alter table public.levels enable row level security;
alter table public.level_ups enable row level security;

-- Insert default level configuration
insert into public.levels (level, xp_required, coin_reward, title) values
  (1, 0, 25, 'Noob'),
  (2, 50, 50, 'Noob'),
  (3, 150, 75, 'Noob'),
  (4, 300, 100, 'Noob'),
  (5, 500, 125, 'Noob'),
  (6, 750, 150, 'Novice'),
  (7, 1050, 175, 'Novice'),
  (8, 1400, 200, 'Novice'),
  (9, 1800, 225, 'Novice'),
  (10, 2250, 250, 'Novice'),
  (11, 2750, 275, 'Intern'),
  (12, 3300, 300, 'Intern'),
  (13, 3900, 325, 'Intern'),
  (14, 4550, 350, 'Intern'),
  (15, 5250, 375, 'Intern'),
  (16, 6000, 400, 'Graduate'),
  (17, 6800, 425, 'Graduate'),
  (18, 7650, 450, 'Graduate'),
  (19, 8550, 475, 'Graduate'),
  (20, 9500, 500, 'Graduate'),
  (21, 10500, 525, 'Junior'),
  (22, 11550, 550, 'Junior'),
  (23, 12650, 575, 'Junior'),
  (24, 13800, 600, 'Junior'),
  (25, 15000, 625, 'Junior'),
  (26, 16250, 650, 'Nerd'),
  (27, 17550, 675, 'Nerd'),
  (28, 18900, 700, 'Nerd'),
  (29, 20300, 725, 'Nerd'),
  (30, 21750, 750, 'Nerd'),
  (31, 23250, 775, 'Senior'),
  (32, 24800, 800, 'Senior'),
  (33, 26400, 825, 'Senior'),
  (34, 28050, 850, 'Senior'),
  (35, 29750, 875, 'Senior'),
  (36, 31500, 900, 'Legend'),
  (37, 33300, 925, 'Legend'),
  (38, 35150, 950, 'Legend'),
  (39, 37050, 975, 'Legend'),
  (40, 39000, 1000, 'Legend'),
  (41, 41000, 1025, 'Mythic'),
  (42, 43050, 1050, 'Mythic'),
  (43, 45150, 1075, 'Mythic'),
  (44, 47300, 1100, 'Mythic'),
  (45, 49500, 1125, 'Mythic'),
  (46, 51750, 1150, 'Ascended'),
  (47, 54050, 1175, 'Ascended'),
  (48, 56400, 1200, 'Ascended'),
  (49, 58800, 1225, 'Ascended'),
  (50, 61250, 1250, 'Ascended'),
  (51, 63750, 1275, 'Transcendent'),
  (52, 66300, 1300, 'Transcendent'),
  (53, 68900, 1325, 'Transcendent'),
  (54, 71550, 1350, 'Transcendent'),
  (55, 74250, 1375, 'Transcendent'),
  (56, 77000, 1400, 'Immortal'),
  (57, 79800, 1425, 'Immortal'),
  (58, 82650, 1450, 'Immortal'),
  (59, 85550, 1475, 'Immortal'),
  (60, 88500, 1500, 'Immortal'),
  (61, 91500, 1525, 'Divine'),
  (62, 94550, 1550, 'Divine'),
  (63, 97650, 1575, 'Divine'),
  (64, 100800, 1600, 'Divine'),
  (65, 104000, 1625, 'Divine'),
  (66, 107250, 1650, 'Cosmic'),
  (67, 110550, 1675, 'Cosmic'),
  (68, 113900, 1700, 'Cosmic'),
  (69, 117300, 1725, 'Cosmic'),
  (70, 120750, 1750, 'Cosmic'),
  (71, 124250, 1775, 'Eternal'),
  (72, 127800, 1800, 'Eternal'),
  (73, 131400, 1825, 'Eternal'),
  (74, 135050, 1850, 'Eternal'),
  (75, 138750, 1875, 'Eternal'),
  (76, 142500, 1900, 'Infinite'),
  (77, 146300, 1925, 'Infinite'),
  (78, 150150, 1950, 'Infinite'),
  (79, 154050, 1975, 'Infinite'),
  (80, 158000, 2000, 'Infinite'),
  (81, 162000, 2025, 'Omnipotent'),
  (82, 166050, 2050, 'Omnipotent'),
  (83, 170150, 2075, 'Omnipotent'),
  (84, 174300, 2100, 'Omnipotent'),
  (85, 178500, 2125, 'Omnipotent'),
  (86, 182750, 2150, 'God'),
  (87, 187050, 2175, 'God'),
  (88, 191400, 2200, 'God'),
  (89, 195800, 2225, 'God'),
  (90, 200250, 2250, 'God'),
  (91, 204750, 2275, 'God of Gods'),
  (92, 209300, 2300, 'God of Gods'),
  (93, 213900, 2325, 'God of Gods'),
  (94, 218550, 2350, 'God of Gods'),
  (95, 223250, 2375, 'God of Gods'),
  (96, 228000, 2400, 'Cracked'),
  (97, 232800, 2425, 'Cracked'),
  (98, 237650, 2450, 'Cracked'),
  (99, 242550, 2475, 'Cracked'),
  (100, 247500, 2500, 'On Crack');

-- Level calculation functions
create or replace function get_level_for_xp(xp integer)
returns integer
language plpgsql
stable
as $$
declare
  user_level integer := 1;
begin
  select level into user_level
  from public.levels
  where xp_required <= xp
  order by level desc
  limit 1;
  
  return coalesce(user_level, 1);
end;
$$;

create or replace function get_xp_for_level(target_level integer)
returns integer
language plpgsql
stable
as $$
declare
  required_xp integer := 0;
begin
  select xp_required into required_xp
  from public.levels
  where level = target_level;
  
  return coalesce(required_xp, 0);
end;
$$;

create or replace function get_xp_to_next_level(current_xp integer)
returns integer
language plpgsql
stable
as $$
declare
  current_level integer;
  next_level_xp integer;
begin
  current_level := get_level_for_xp(current_xp);
  
  select xp_required into next_level_xp
  from public.levels
  where level = current_level + 1;
  
  if next_level_xp is null then
    return 0; -- Max level reached
  end if;
  
  return next_level_xp - current_xp;
end;
$$;

create or replace function get_level_rewards(target_level integer)
returns table(coin_reward integer, title text, special_reward jsonb)
language plpgsql
stable
as $$
begin
  return query
  select l.coin_reward, l.title, l.special_reward
  from public.levels l
  where l.level = target_level;
end;
$$;

-- Enhanced function to increment user stats and handle level-ups
create or replace function increment_user_stats_with_levelup(p_user_id uuid, p_xp integer)
returns void
language plpgsql
security definer
as $$
declare
  v_old_level integer;
  v_new_total_xp integer;
  v_new_level integer;
  v_level_reward record;
begin
  -- Get current user data
  select level, total_xp + p_xp
  into v_old_level, v_new_total_xp
  from public.users
  where id = p_user_id;

  -- Calculate new level using the levels table
  v_new_level := get_level_for_xp(v_new_total_xp);

  -- Update user stats
  update public.users
  set 
    total_xp = total_xp + p_xp,
    quest_count = quest_count + 1,
    monthly_xp = monthly_xp + p_xp,
    monthly_quest_count = monthly_quest_count + 1,
    level = v_new_level
  where id = p_user_id;

  -- If user leveled up, create level_up record and award rewards
  if v_new_level > v_old_level then
    -- Get rewards for the new level
    select * into v_level_reward
    from get_level_rewards(v_new_level);
    
    -- Create level up record
    insert into public.level_ups (user_id, level, xp, claimed)
    values (p_user_id, v_new_level, v_new_total_xp, false);
  end if;
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
    monthly_xp = 0,
    monthly_quest_count = 0;
end;
$$;

-- Function to claim level up and award rewards atomically
create or replace function claim_level_up_with_rewards(
  p_level_up_id uuid,
  p_user_id uuid,
  p_coin_reward integer,
  p_special_reward jsonb default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_awarded_rewards jsonb := '{}';
begin
  -- Start transaction (implicit in function)
  
  -- Mark level up as claimed
  update public.level_ups
  set claimed = true
  where id = p_level_up_id and user_id = p_user_id and claimed = false;
  
  -- Check if the update actually happened (level up exists and wasn't already claimed)
  if not found then
    raise exception 'Level up not found or already claimed';
  end if;
  
  -- Award coin rewards to user
  update public.users
  set coins = coins + p_coin_reward
  where id = p_user_id;
  
  -- Check if user exists
  if not found then
    raise exception 'User not found';
  end if;
  
  -- Build response with awarded rewards
  v_awarded_rewards := jsonb_build_object(
    'coins', p_coin_reward,
    'special_reward', coalesce(p_special_reward, 'null'::jsonb)
  );
  
  -- TODO: Handle special rewards based on their type
  -- This is where you would implement logic for different special reward types
  -- For example:
  -- if p_special_reward ? 'items' then
  --   -- Add items to user inventory
  -- end if;
  -- if p_special_reward ? 'unlocks' then
  --   -- Unlock features/content for user
  -- end if;
  
  return v_awarded_rewards;
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

-- Service role can update any user (for webhooks, automated processes)
create policy "Service role can update users"
  on public.users
  for update
  using (auth.jwt() ->> 'role' = 'service_role');

-- Quests table policies
create policy "Quests are viewable by everyone"
  on public.quests
  for select
  using (true);

create policy "Users can insert their own quests"
  on public.quests
  for insert
  with check (auth.uid() = user_id);

-- Service role can insert any quest (for webhooks)
create policy "Service role can insert quests"
  on public.quests
  for insert
  using (auth.jwt() ->> 'role' = 'service_role');

-- Levels table policies
create policy "Levels are viewable by everyone"
  on public.levels
  for select
  using (true);

-- Level ups table policies
create policy "Level ups are viewable by everyone"
  on public.level_ups
  for select
  using (true);

create policy "Users can update their own level ups"
  on public.level_ups
  for update
  using (auth.uid() = user_id);

-- Service role can insert level ups (for automated level-up system)
create policy "Service role can insert level ups"
  on public.level_ups
  for insert
  using (auth.jwt() ->> 'role' = 'service_role');

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