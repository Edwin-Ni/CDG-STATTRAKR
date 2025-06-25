"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Quest } from "../types/database";

export default function QuestLogClient() {
  const [data, setData] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/quests");

        if (!response.ok) {
          throw new Error("Failed to fetch quest data");
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching quests:", err);
        setError("Failed to load quests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-3 sm:p-4">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-6 sm:h-8 bg-[#262840] rounded-md w-1/4"></div>
          <div className="h-12 sm:h-16 bg-[#262840] rounded-md"></div>
          <div className="h-12 sm:h-16 bg-[#262840] rounded-md"></div>
          <div className="h-12 sm:h-16 bg-[#262840] rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 bg-[#e74c3c] text-white rounded-md pixel-font text-sm sm:text-base">
        {error}
      </div>
    );
  }

  // Map action types to corresponding quest icons or images
  const getQuestIcon = (type: string) => {
    switch (type) {
      case "github_commit":
        return (
          <Image
            src="/images/commit.png"
            alt="Commit"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
        );
      case "github_pr_opened":
        return (
          <Image
            src="/images/opening_pr.png"
            alt="PR Opened"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
        );
      case "github_pr_merged":
        return "🔀";
      case "github_issue":
        return "🐛";
      case "github_pr_review":
        return "👀";
      default:
        return "✨";
    }
  };

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md overflow-hidden shadow-lg">
      <ul className="divide-y divide-[#3d3f5a]">
        {data.map((action) => (
          <li key={action.id} className="p-3 sm:p-4 hover:bg-[#262840]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#262840] text-lg sm:text-2xl rounded-md border border-[#3d3f5a]">
                  {getQuestIcon(action.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-md font-medium text-white pixel-font truncate">
                    {action.username}
                  </p>
                  <p className="text-sm sm:text-md text-[#7eb8da] pixel-font truncate">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-shrink-0 sm:space-x-4">
                <div className="flex flex-col text-xs sm:text-md text-[#7eb8da] pixel-font min-w-0">
                  <span className="truncate">
                    {new Date(action.created_at).toLocaleDateString()}
                  </span>
                  <span className="truncate">
                    {new Date(action.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="ml-2 inline-flex items-center whitespace-nowrap px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium bg-[#262840] text-[#ffce63] border border-[#ffce63] pixel-font">
                  +{action.xp} XP
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
