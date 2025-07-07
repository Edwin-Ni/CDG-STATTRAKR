"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  id: string;
  username: string;
  total_xp: number;
  level: number;
  quest_count: number;
};

export default function LeaderboardClient() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [monthlyToggle, setMonthlyToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          monthlyToggle ? "/api/monthly-leaderboard" : "/api/leaderboard"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [monthlyToggle]);

  if (loading) {
    return (
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-2 sm:p-4">
        <div className="animate-pulse space-y-2 sm:space-y-4">
          <div className="h-6 sm:h-8 bg-[#262840] rounded-md w-1/2 sm:w-1/4"></div>
          <div className="h-8 sm:h-12 bg-[#262840] rounded-md"></div>
          <div className="h-8 sm:h-12 bg-[#262840] rounded-md"></div>
          <div className="h-8 sm:h-12 bg-[#262840] rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 bg-[#e74c3c] text-white rounded-md pixel-font text-sm sm:text-base">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2">
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setMonthlyToggle(true)}
            disabled={loading}
            className={`flex-1 sm:flex-none  px-2 sm:px-3 py-1 rounded-md  pixel-font text-xs sm:text-md ${
              monthlyToggle
                ? "bg-[#e5b958] hover:bg-[#e5b958] text-[#1e1f2e]"
                : "bg-[#1e1f2e] text-[#7eb8da] border-2 border-[#7eb8da] hover:bg-[#262840]"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading && monthlyToggle ? "Loading..." : "Monthly"}
          </button>
          <button
            onClick={() => setMonthlyToggle(false)}
            disabled={loading}
            className={`flex-1 sm:flex-none border-2 px-2 sm:px-3 py-1 rounded-md pixel-font text-xs sm:text-md ${
              monthlyToggle
                ? "bg-[#1e1f2e] text-[#7eb8da] border-[#7eb8da] hover:bg-[#262840]"
                : "bg-[#ffce63] text-[#1e1f2e] border-[#ffce63] hover:bg-[#e5b958]"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading && !monthlyToggle ? "Loading..." : "All Time"}
          </button>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden space-y-2">
        {data.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[#7eb8da] font-bold pixel-font text-sm flex-shrink-0">
                  #{index + 1}
                </span>
                {index === 0 && (
                  <img
                    src="/images/crown.png"
                    alt="Crown"
                    className="w-6 h-6 flex-shrink-0"
                  />
                )}
                <span className="text-white pixel-font text-sm font-medium truncate min-w-0">
                  {entry.username}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#e74c3c] pixel-font text-sm">
                Lvl {entry.level}
              </span>
              <span className="text-[#ffce63] pixel-font text-sm">
                {entry.total_xp} XP
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#262840] text-[#7eb8da]">
              <tr className="border-b-2 border-[#7eb8da]">
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm uppercase tracking-wider pixel-font">
                  Rank
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm uppercase tracking-wider pixel-font">
                  Player
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm uppercase tracking-wider pixel-font">
                  Level
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm uppercase tracking-wider pixel-font">
                  XP
                </th>
                <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs sm:text-sm uppercase tracking-wider pixel-font">
                  Quests
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d3f5a]">
              {data.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-[#262840]">
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm lg:text-md text-[#7eb8da] font-bold pixel-font">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <span className="text-[#ffce63] mr-1">{index + 1}</span>
                        <img
                          src="/images/crown.png"
                          alt="Crown"
                          className="w-6 h-6 lg:w-10 lg:h-10 inline-block"
                        />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap">
                    <div className="text-sm lg:text-md font-medium text-white pixel-font">
                      {entry.username}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm lg:text-md text-[#e74c3c] pixel-font">
                    {entry.level}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm lg:text-md text-[#ffce63] pixel-font">
                    {entry.total_xp}
                  </td>
                  <td className="px-3 lg:px-6 py-2 lg:py-4 whitespace-nowrap text-sm lg:text-md text-[#7eb8da] pixel-font">
                    {entry.quest_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
