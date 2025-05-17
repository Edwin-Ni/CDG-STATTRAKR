"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { getUserById } from "../lib/db";
import ActionForm from "./ActionForm";
import CountdownTimer from "./CountdownTimer";

// Lazy load components
const LeaderboardClient = lazy(() => import("./LeaderboardClient"));
const ActionLogClient = lazy(() => import("./ActionLogClient"));

function LeaderboardSkeleton() {
  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#262840] rounded-md w-1/4"></div>
        <div className="h-12 bg-[#262840] rounded-md"></div>
        <div className="h-12 bg-[#262840] rounded-md"></div>
        <div className="h-12 bg-[#262840] rounded-md"></div>
      </div>
    </div>
  );
}

function ActionLogSkeleton() {
  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#262840] rounded-md w-1/4"></div>
        <div className="h-16 bg-[#262840] rounded-md"></div>
        <div className="h-16 bg-[#262840] rounded-md"></div>
        <div className="h-16 bg-[#262840] rounded-md"></div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-[#1e1f2e] border-2 border-[#3d3f5a] rounded-md p-3 text-center"
        >
          <div className="h-6 bg-[#262840] rounded-md w-2/3 mx-auto mb-2"></div>
          <div className="h-8 bg-[#262840] rounded-md w-1/2 mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

export default function ClientHomeWrapper() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<{
    totalPoints: number;
    actionCount: number;
    level: number;
    coins: number;
    isLoading: boolean;
  }>({
    totalPoints: 0,
    actionCount: 0,
    level: 1,
    coins: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;

      try {
        const userData = await getUserById(user.id);

        // Calculate level based on XP (total_points) - match leaderboard calculation
        const level = Math.floor(userData.total_points / 10) + 5;

        // Mock coins: 100 * level + random factor
        const coins = 100 * level + Math.floor(Math.random() * 50) * 10;

        setUserStats({
          totalPoints: userData.total_points,
          actionCount: userData.action_count,
          level,
          coins,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setUserStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    if (user?.id) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div className="bg-[#1e1f2e] min-h-screen flex flex-col gap-8 p-6">
      {/* Stats Bar */}
      {userStats.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-2">
          <div className="bg-[#1e1f2e] border-2 border-[#ffce63] rounded-md p-3 text-center">
            <div className="text-md text-[#ffce63] uppercase tracking-wider pixel-font">
              ⭐ Level
            </div>
            <div className="text-3xl font-bold text-[#ffce63] pixel-font">
              {userStats.level}
            </div>
          </div>
          <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-3 text-center">
            <div className="text-md text-[#7eb8da] uppercase tracking-wider pixel-font">
              ⚡ XP
            </div>
            <div className="text-3xl font-bold text-[#7eb8da] pixel-font">
              {userStats.totalPoints.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#1e1f2e] border-2 border-[#e74c3c] rounded-md p-3 text-center">
            <div className="text-md text-[#e74c3c] uppercase tracking-wider pixel-font">
              📋 Quests
            </div>
            <div className="text-3xl font-bold text-[#e74c3c] pixel-font">
              {userStats.actionCount}
            </div>
          </div>
          <div className="bg-[#1e1f2e] border-2 border-[#ffce63] rounded-md p-3 text-center">
            <div className="text-md text-[#ffce63] uppercase tracking-wider pixel-font">
              💰 Coins
            </div>
            <div className="text-3xl font-bold text-[#ffce63] pixel-font">
              {userStats.coins.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Monthly reset countdown */}
      <CountdownTimer />

      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#e74c3c] uppercase tracking-wider pixel-font">
          Leaderboard
        </h2>
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardClient />
        </Suspense>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#e74c3c] uppercase tracking-wider pixel-font">
          Recent Quests
        </h2>
        <Suspense fallback={<ActionLogSkeleton />}>
          <ActionLogClient />
        </Suspense>
      </section>

      {/* Action Form */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#e74c3c] uppercase tracking-wider pixel-font">
          New Quest
        </h2>
        <ActionForm />
      </section>

      {/* <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="bg-[#1e1f2e] border-2 border-[#ffce63] rounded-md p-4 flex items-center space-x-3">
          <div className="text-4xl">🏆</div>
          <div>
            <div className="text-lg text-[#ffce63] font-bold pixel-font">
              First Quest Completed
            </div>
            <div className="text-md text-[#7eb8da] pixel-font">
              You finished your first quest!
            </div>
          </div>
        </div>
        <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 flex items-center space-x-3">
          <div className="text-4xl">🎮</div>
          <div>
            <div className="text-lg text-[#7eb8da] font-bold pixel-font">
              Weekly Winner
            </div>
            <div className="text-md text-[#7eb8da] pixel-font">
              Top of the leaderboard this week!
            </div>
          </div>
        </div>
        <div className="bg-[#1e1f2e] border-2 border-[#e74c3c] rounded-md p-4 flex items-center space-x-3">
          <div className="text-4xl">🎯</div>
          <div>
            <div className="text-lg text-[#e74c3c] font-bold pixel-font">
              10 Quests Mastered
            </div>
            <div className="text-md text-[#7eb8da] pixel-font">
              Complete 10 different quests.
            </div>
          </div>
        </div>
      </div> */}

      {/* <footer className="mt-8 pt-6 border-t-2 border-[#3d3f5a] text-center text-[#7eb8da] pixel-font">
        <div className="text-xl uppercase tracking-widest mb-2">
          PIXEL DASH | Level up. Play more. Conquer the leaderboard.
        </div>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-2xl text-[#7eb8da] hover:text-[#ffce63]">
            🐦
          </a>
          <a href="#" className="text-2xl text-[#7eb8da] hover:text-[#ffce63]">
            👾
          </a>
          <a href="#" className="text-2xl text-[#7eb8da] hover:text-[#ffce63]">
            📺
          </a>
        </div>
      </footer> */}
    </div>
  );
}
