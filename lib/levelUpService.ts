import type { Level } from "../types/database";
import { supabase } from "./supabase";

export interface LevelUpRewards {
  coins: number;
  special_reward: any;
}

export interface ClaimLevelUpOptions {
  onSuccess?: (rewards: LevelUpRewards) => void;
  onError?: (error: Error) => void;
}

/**
 * Claims a level up reward for the user, including coins and special rewards
 * @param levelUpId - The ID of the level up to claim
 * @param options - Optional callbacks for success and error handling
 * @returns Promise<LevelUpRewards | null> - Returns reward details if successful, null otherwise
 */
export async function claimLevelUpWithRewards(
  levelUpId: string,
  options?: ClaimLevelUpOptions
): Promise<LevelUpRewards | null> {
  try {
    // First, get the level-up details including the level info
    const { data: levelUpData, error: fetchError } = await supabase
      .from("level_ups")
      .select(
        `
        *,
        level_info:levels(*)
      `
      )
      .eq("id", levelUpId)
      .eq("claimed", false)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch level up details");
    }

    if (!levelUpData) {
      throw new Error("Level up not found or already claimed");
    }

    const levelInfo = levelUpData.level_info as Level;

    // Mark level up as claimed
    const { error: claimError } = await supabase
      .from("level_ups")
      .update({ claimed: true })
      .eq("id", levelUpId)
      .eq("user_id", levelUpData.user_id)
      .eq("claimed", false);

    if (claimError) {
      throw new Error("Failed to claim level up");
    }

    // Get current user coins to calculate new amount
    const { data: userData, error: userFetchError } = await supabase
      .from("users")
      .select("coins")
      .eq("id", levelUpData.user_id)
      .single();

    if (userFetchError) {
      throw new Error("Failed to fetch user data");
    }

    // Award coin rewards to user
    const newCoinAmount = userData.coins + levelInfo.coin_reward;
    const { error: rewardError } = await supabase
      .from("users")
      .update({ coins: newCoinAmount })
      .eq("id", levelUpData.user_id);

    if (rewardError) {
      throw new Error("Failed to award coin rewards");
    }

    // Prepare reward response
    const rewards: LevelUpRewards = {
      coins: levelInfo.coin_reward,
      special_reward: levelInfo.special_reward,
    };

    // Handle special rewards (extensible for future reward types)
    if (levelInfo.special_reward) {
      console.log("Special rewards awarded:", levelInfo.special_reward);
      // TODO: Implement special reward logic based on reward type
      // Example:
      // - Add items to inventory
      // - Unlock features/content
      // - Grant achievements
      // - Apply temporary bonuses
    }

    options?.onSuccess?.(rewards);
    return rewards;
  } catch (error) {
    console.error("Error claiming level up:", error);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    options?.onError?.(errorObj);
    return null;
  }
}
