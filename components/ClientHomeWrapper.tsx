"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import {
  getLevelByNumber,
  getLevelProgress,
  getUnclaimedLevelUps,
  getUserById,
  getXpToNextLevel,
} from "../lib/db";
import { claimLevelUpWithRewards } from "../lib/levelUpService";
import type { Level, LevelUp } from "../types/database";
import CountdownTimer from "./CountdownTimer";
import LeaderboardClient from "./LeaderboardClient";
import LevelProgressCard from "./LevelProgressCard";
import LevelUpNotification from "./LevelUpNotification";
import QuestForm from "./QuestForm";
import QuestLogClient from "./QuestLogClient";
import StatsGrid from "./StatsGrid";
import StatsSkeleton from "./StatsSkeleton";

export default function ClientHomeWrapper() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<{
    totalXp: number;
    questCount: number;
    level: number;
    coins: number;
    xpToNext: number;
    currentLevelInfo: Level | null;
    progressPercentage: number;
    isLoading: boolean;
  }>({
    totalXp: 0,
    questCount: 0,
    level: 1,
    coins: 0,
    xpToNext: 0,
    currentLevelInfo: null,
    progressPercentage: 0,
    isLoading: true,
  });

  const [levelUps, setLevelUps] = useState<(LevelUp & { level_info: Level })[]>(
    []
  );

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const [userData, unclaimedLevelUps] = await Promise.all([
        getUserById(user.id),
        getUnclaimedLevelUps(user.id),
      ]);

      const [xpToNext, currentLevelInfo, nextLevelInfo] = await Promise.all([
        getXpToNextLevel(userData.total_xp),
        getLevelByNumber(userData.level),
        getLevelByNumber(userData.level + 1),
      ]);

      let progressPercentage = 0;
      if (currentLevelInfo) {
        const progress = getLevelProgress(
          userData.total_xp,
          currentLevelInfo,
          nextLevelInfo || undefined
        );
        progressPercentage = progress.progressPercentage;
      }

      setUserStats({
        totalXp: userData.total_xp,
        questCount: userData.quest_count,
        level: userData.level,
        coins: userData.coins,
        xpToNext,
        currentLevelInfo,
        progressPercentage,
        isLoading: false,
      });

      setLevelUps(unclaimedLevelUps);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserStats((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const handleClaimLevelUp = async (levelUpId: string) => {
    const rewards = await claimLevelUpWithRewards(levelUpId, {
      onSuccess: (rewardsData) => {
        setLevelUps((prev) => prev.filter((lu) => lu.id !== levelUpId));

        // Handle special rewards if they exist
        if (rewardsData.special_reward && rewardsData.special_reward !== null) {
          console.log("Special rewards received:", rewardsData.special_reward);
          // TODO: Show special reward notification or handle special reward logic
          // For example, you might want to show a special modal or toast notification
        }

        // Refresh user data to get updated stats (including coin balance)
        fetchUserData();
      },
      onError: (error) => {
        console.error("Error claiming level up:", error);
      },
    });
  };

  return (
    <div className="bg-[#1e1f2e] min-h-screen flex flex-col gap-2 sm:gap-4 p-2 sm:p-6">
      {/* Level Up Notifications */}
      {levelUps.map((levelUp) => (
        <LevelUpNotification
          key={levelUp.id}
          levelUp={levelUp}
          onClaim={handleClaimLevelUp}
        />
      ))}

      {/* Stats Bar */}
      {userStats.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="flex flex-col gap-2 sm:gap-4">
          <LevelProgressCard
            level={userStats.level}
            currentLevelInfo={userStats.currentLevelInfo}
            xpToNext={userStats.xpToNext}
            progressPercentage={userStats.progressPercentage}
          />
          <StatsGrid
            totalXp={userStats.totalXp}
            questCount={userStats.questCount}
            coins={userStats.coins}
          />
        </div>
      )}

      {/* Monthly reset countdown*/}
      <CountdownTimer />

      {/* Leaderboard */}
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font truncate">
          🏆 Leaderboard
        </h2>
        <LeaderboardClient />
      </div>

      {/* Quest Log */}
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font truncate">
          📜 Recent Quests
        </h2>
        <QuestLogClient />
      </div>

      {/* Quest Form */}
      <QuestForm onQuestCreated={fetchUserData} />
    </div>
  );
}
