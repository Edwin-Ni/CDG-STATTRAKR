/**
 * This file defines the Supabase database schema needed for monthly leaderboard resets.
 *
 * Tables:
 * 1. users - User information
 * 2. actions - Individual actions that earn points
 * 3. monthly_leaderboards - Archived monthly leaderboards
 */

// Sample SQL to create these tables in Supabase:

/*
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actions table (stores each individual point-earning action)
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly leaderboard archives
CREATE TABLE monthly_leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL, -- 1-12
  total_points INTEGER NOT NULL,
  action_count INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

-- Create index for faster querying
CREATE INDEX actions_created_at_idx ON actions(created_at);
CREATE INDEX actions_user_id_idx ON actions(user_id);
CREATE INDEX monthly_leaderboards_year_month_idx ON monthly_leaderboards(year, month);
*/

// Helper function to query current month's leaderboard
export async function getCurrentMonthLeaderboard(supabase: any) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from("actions")
    .select(
      `
      user_id,
      users:user_id (username, avatar_url),
      points:sum(points),
      action_count:count(*)
    `
    )
    .gte("created_at", firstDayOfMonth.toISOString())
    .group("user_id, users.username, users.avatar_url")
    .order("points", { ascending: false });

  return { data, error };
}

// Helper function to archive a month's leaderboard
export async function archiveMonthlyLeaderboard(
  supabase: any,
  year: number,
  month: number
) {
  // Get the leaderboard data
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Get the leaderboard data
  const { data: leaderboardData, error: fetchError } = await supabase
    .from("actions")
    .select(
      `
      user_id,
      points:sum(points),
      action_count:count(*)
    `
    )
    .gte("created_at", firstDayOfMonth.toISOString())
    .lte("created_at", lastDayOfMonth.toISOString())
    .group("user_id")
    .order("points", { ascending: false });

  if (fetchError) {
    return { error: fetchError };
  }

  // Insert into monthly leaderboard archive
  const archiveEntries = leaderboardData.map((entry, index) => ({
    user_id: entry.user_id,
    year,
    month,
    total_points: entry.points,
    action_count: entry.action_count,
    rank: index + 1,
  }));

  const { error: insertError } = await supabase
    .from("monthly_leaderboards")
    .upsert(archiveEntries);

  return { data: archiveEntries, error: insertError };
}
