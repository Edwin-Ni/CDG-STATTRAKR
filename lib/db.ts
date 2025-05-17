import type { Action, User } from "../types/database";
import { supabase } from "./supabase";

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("total_points", { ascending: false });

  if (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to fetch leaderboard");
  }

  return data as User[];
}

export async function getRecentActions(limit = 20) {
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent actions:", error);
    throw new Error("Failed to fetch recent actions");
  }

  return data as Action[];
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }

  return data as User;
}

export async function createAction(action: Omit<Action, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("actions")
    .insert(action)
    .select()
    .single();

  if (error) {
    console.error("Error creating action:", error);
    throw new Error("Failed to create action");
  }

  // Update the user's stats
  const { error: updateError } = await supabase.rpc("increment_user_stats", {
    p_user_id: action.user_id,
    p_points: action.points,
  });

  if (updateError) {
    console.error("Error updating user stats:", updateError);
    // Continue despite this error, as the action was created
  }

  return data as Action;
}

export async function getLastReset() {
  const { data, error } = await supabase
    .from("reset_history")
    .select("*")
    .order("reset_date", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching last reset:", error);
    throw new Error("Failed to fetch last reset");
  }

  if (data && data.length > 0) {
    return data[0].reset_date;
  }

  // If no reset history, return first day of current month
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function getNextReset() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
