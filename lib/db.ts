import type { Level, LevelUp, Quest, User } from "../types/database";
import { supabase } from "./supabase";

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

export async function getAllLevels(): Promise<Level[]> {
  const { data, error } = await supabase
    .from("levels")
    .select("*")
    .order("level", { ascending: true });

  if (error) {
    console.error("Error fetching levels:", error);
    throw new Error("Failed to fetch levels");
  }

  return data as Level[];
}

export async function getLevelByNumber(level: number): Promise<Level | null> {
  const { data, error } = await supabase
    .from("levels")
    .select("*")
    .eq("level", level)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching level:", error);
    throw new Error("Failed to fetch level");
  }

  return data as Level;
}

export async function getLevelForXp(xp: number): Promise<Level> {
  const { data, error } = await supabase.rpc("get_level_for_xp", { xp });

  if (error) {
    console.error("Error calculating level for XP:", error);
    throw new Error("Failed to calculate level");
  }

  // Get the full level details
  const level = await getLevelByNumber(data);
  if (!level) {
    throw new Error("Level not found");
  }

  return level;
}

export async function getXpToNextLevel(currentXp: number): Promise<number> {
  const { data, error } = await supabase.rpc("get_xp_to_next_level", {
    current_xp: currentXp,
  });

  if (error) {
    console.error("Error calculating XP to next level:", error);
    throw new Error("Failed to calculate XP to next level");
  }

  return data as number;
}

export async function createQuest(quest: Omit<Quest, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("quests")
    .insert(quest)
    .select()
    .single();

  if (error) {
    console.error("Error creating quest:", error);
    throw new Error("Failed to create quest");
  }

  // Update the user's stats and handle level-ups
  const { error: updateError } = await supabase.rpc(
    "increment_user_stats_with_levelup",
    {
      p_user_id: quest.user_id,
      p_xp: quest.xp,
    }
  );

  if (updateError) {
    console.error("Error updating user stats:", updateError);
    // Continue despite this error, as the quest was created
  }

  return data as Quest;
}

export async function getUnclaimedLevelUps(
  userId: string
): Promise<(LevelUp & { level_info: Level })[]> {
  const { data, error } = await supabase
    .from("level_ups")
    .select(
      `
      *,
      level_info:levels(*)
    `
    )
    .eq("user_id", userId)
    .eq("claimed", false)
    .order("level", { ascending: false });

  if (error) {
    console.error("Error fetching unclaimed level ups:", error);
    throw new Error("Failed to fetch unclaimed level ups");
  }

  return data as (LevelUp & { level_info: Level })[];
}

// Utility functions for level progression display
export function getLevelProgress(
  currentXp: number,
  level: Level,
  nextLevel?: Level
): {
  currentLevelXp: number;
  nextLevelXp: number;
  progressXp: number;
  progressPercentage: number;
} {
  const currentLevelXp = level.xp_required;
  const nextLevelXp = nextLevel?.xp_required || currentLevelXp;
  const progressXp = currentXp - currentLevelXp;
  const totalXpForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercentage =
    totalXpForNextLevel > 0 ? (progressXp / totalXpForNextLevel) * 100 : 100;

  return {
    currentLevelXp,
    nextLevelXp,
    progressXp,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
}
