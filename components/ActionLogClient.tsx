"use client";

import { useEffect, useState } from "react";

type Action = {
  id: string;
  username: string;
  type: string;
  points: number;
  created_at: string;
  description: string;
};

export default function ActionLogClient() {
  const [data, setData] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/actions");

        if (!response.ok) {
          throw new Error("Failed to fetch action data");
        }

        const json = await response.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching actions:", err);
        setError("Failed to load actions");
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
          <div className="h-16 bg-[#262840] rounded-md"></div>
          <div className="h-16 bg-[#262840] rounded-md"></div>
          <div className="h-16 bg-[#262840] rounded-md"></div>
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

  // Map action types to corresponding quest icons
  const getActionIcon = (type: string) => {
    switch (type) {
      case "github_commit":
        return "📝";
      case "github_pull_request":
        return "🔀";
      case "github_issue":
        return "🐛";
      case "github_code_review":
        return "👀";
      default:
        return "✨";
    }
  };

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md overflow-hidden shadow-lg">
      <div className="flow-root">
        <ul className="divide-y divide-[#3d3f5a]">
          {data.map((action) => (
            <li key={action.id} className="p-4 hover:bg-[#262840]">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#262840] text-2xl rounded-md border border-[#3d3f5a]">
                  {getActionIcon(action.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-md font-medium text-white pixel-font">
                    {action.username}
                  </p>
                  <p className="text-md text-[#7eb8da] truncate pixel-font">
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-md text-[#7eb8da] pixel-font">
                  {new Date(action.created_at).toLocaleDateString()}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#262840] text-[#ffce63] border border-[#ffce63] pixel-font">
                  +{action.points} XP
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
