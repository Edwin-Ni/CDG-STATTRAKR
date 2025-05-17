"use client";

import { useEffect, useState } from "react";

type LeaderboardEntry = {
  id: string;
  username: string;
  total_points: number;
  action_count: number;
};

type ResetInfo = {
  lastReset: string;
  nextReset: string;
};

export default function LeaderboardClient() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [resetInfo, setResetInfo] = useState<ResetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/leaderboard");

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const json = await response.json();
        setData(json.data);
        setResetInfo(json.resetInfo);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <div className="p-4 bg-[#e74c3c] text-white rounded-md pixel-font">
        {error}
      </div>
    );
  }

  const lastResetDate = resetInfo
    ? new Date(resetInfo.lastReset).toLocaleDateString()
    : "Unknown";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <div className="text-md text-[#7eb8da] italic pixel-font">
          Current standings since {lastResetDate}
        </div>
        <div className="flex gap-2">
          <button className="bg-[#1e1f2e] text-[#7eb8da] border-2 border-[#7eb8da] px-3 py-1 rounded-md hover:bg-[#262840] pixel-font text-md">
            This Month
          </button>
          <button className="bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] px-3 py-1 rounded-md hover:bg-[#e5b958] pixel-font text-md">
            All Time
          </button>
        </div>
      </div>
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md overflow-hidden shadow-lg">
        <table className="min-w-full">
          <thead className="bg-[#262840] text-[#7eb8da]">
            <tr className="border-b-2 border-[#7eb8da]">
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider pixel-font">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider pixel-font">
                Player
              </th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider pixel-font">
                Level
              </th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider pixel-font">
                XP
              </th>
              <th className="px-6 py-3 text-left text-sm uppercase tracking-wider pixel-font">
                Quests
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3d3f5a]">
            {data.map((entry, index) => (
              <tr key={entry.id} className="hover:bg-[#262840]">
                <td className="px-6 py-4 whitespace-nowrap text-md text-[#7eb8da] font-bold pixel-font">
                  {index === 0 ? (
                    <div className="flex items-center">
                      <span className="text-[#ffce63] mr-1">{index + 1}</span>
                      <img
                        src="/images/crown.png"
                        alt="Crown"
                        className="w-10 h-10 inline-block"
                      />
                    </div>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-md font-medium text-white pixel-font">
                    {entry.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-[#7eb8da] pixel-font">
                  {Math.floor(entry.total_points / 10) + 5}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-[#ffce63] pixel-font">
                  {entry.total_points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-[#e74c3c] pixel-font">
                  {entry.action_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
