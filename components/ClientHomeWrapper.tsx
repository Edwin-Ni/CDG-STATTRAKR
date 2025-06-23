"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import {
  claimLevelUp,
  getLevelByNumber,
  getLevelProgress,
  getUnclaimedLevelUps,
  getUserById,
  getXpToNextLevel,
} from "../lib/db";
import type { Level, LevelUp } from "../types/database";
import CountdownTimer from "./CountdownTimer";
import LeaderboardClient from "./LeaderboardClient";
import QuestForm from "./QuestForm";
import QuestLogClient from "./QuestLogClient";

// Skeleton component for loading state
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-[#1e1f2e] border-2 border-[#3d3f5a] rounded-md p-3 text-center animate-pulse"
        >
          <div className="h-4 bg-[#3d3f5a] rounded mb-2"></div>
          <div className="h-8 bg-[#3d3f5a] rounded"></div>
        </div>
      ))}
    </div>
  );
}

// Enhanced level up notification component
function LevelUpNotification({
  levelUp,
  onClaim,
}: {
  levelUp: LevelUp & { level_info: Level };
  onClaim: (id: string) => void;
}) {
  const { level_info } = levelUp;

  return (
    <div className="bg-gradient-to-r from-[#ffce63] to-[#e5b958] text-[#1e1f2e] p-4 rounded-md mb-4 border-2 border-[#ffce63] shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{level_info.title}</div>
          <div>
            <h3 className="text-xl font-bold pixel-font">🎉 LEVEL UP!</h3>
            <p className="pixel-font font-semibold">
              Level {levelUp.level}: {level_info.title}
            </p>
            {level_info.coin_reward > 0 && (
              <p className="pixel-font text-sm font-bold">
                Reward: {level_info.coin_reward} coins!
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onClaim(levelUp.id)}
          className="bg-[#1e1f2e] text-[#ffce63] border-2 border-[#1e1f2e] px-4 py-2 rounded-md hover:bg-[#262840] pixel-font font-bold"
        >
          CLAIM
        </button>
      </div>
    </div>
  );
}

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
    try {
      await claimLevelUp(levelUpId);
      setLevelUps((prev) => prev.filter((lu) => lu.id !== levelUpId));
      // Refresh user data to get updated stats
      await fetchUserData();
    } catch (error) {
      console.error("Error claiming level up:", error);
    }
  };

  return (
    <div className="bg-[#1e1f2e] min-h-screen flex flex-col gap-8 p-6">
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
        <div>
          <div className="bg-[#1e1f2e] border-2 border-[#ffce63] rounded-md p-3 text-center">
            <div className="text-md text-[#ffce63] uppercase tracking-wider pixel-font">
              Level {userStats.level}
            </div>
            <div className="text-3xl font-bold text-[#ffce63] pixel-font">
              {userStats.currentLevelInfo?.title}
            </div>
            {userStats.xpToNext > 0 && (
              <>
                <div className="text-xs text-[#ffce63] pixel-font mt-1">
                  {userStats.xpToNext} XP left
                </div>
                <div className="w-full bg-[#262840] rounded-full h-2 mt-2">
                  <div
                    className="bg-[#ffce63] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${userStats.progressPercentage}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="border-2 border-[#7eb8da] rounded-md p-3 text-center">
              <div className="text-md text-[#7eb8da] uppercase tracking-wider pixel-font">
                ⚡ <br /> XP
              </div>
              <div className="text-3xl font-bold text-[#7eb8da] pixel-font">
                {userStats.totalXp.toLocaleString()}
              </div>
            </div>
            <div className="border-2 border-[#e74c3c] rounded-md p-3 text-center">
              <div className="text-md text-[#e74c3c] uppercase tracking-wider pixel-font">
                📋 <br /> Quests
              </div>
              <div className="text-3xl font-bold text-[#e74c3c] pixel-font">
                {userStats.questCount}
              </div>
            </div>
            <div className="border-2 border-[#ffce63] rounded-md p-3 text-center">
              <div className="text-md text-[#ffce63] uppercase tracking-wider pixel-font">
                💰 <br /> Coins
              </div>
              <div className="text-3xl font-bold text-[#ffce63] pixel-font">
                {userStats.coins.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly reset countdown*/}
      <CountdownTimer />

      {/* Leaderboard */}
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
          🏆 Leaderboard
        </h2>
        <LeaderboardClient />
      </div>

      {/* Quest Log */}
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
          📜 Recent Quests
        </h2>
        <QuestLogClient />
      </div>

      {/* Quest Form */}
      <QuestForm onQuestCreated={fetchUserData} />
    </div>
  );
}
