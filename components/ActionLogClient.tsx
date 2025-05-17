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
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-500 rounded">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {data.map((action) => (
            <li key={action.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {action.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {new Date(action.created_at).toLocaleDateString()}
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{action.points} points
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
