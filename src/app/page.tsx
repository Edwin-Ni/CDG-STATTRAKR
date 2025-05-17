import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <Suspense fallback={<LeaderboardSkeleton />}>
          <Leaderboard />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Actions</h2>
        <Suspense fallback={<ActionLogSkeleton />}>
          <ActionLog />
        </Suspense>
      </section>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function ActionLogSkeleton() {
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

async function Leaderboard() {
  try {
    // Mock data instead of fetching from API
    const data = [
      { id: "1", username: "User One", total_points: 100, action_count: 10 },
      { id: "2", username: "User Two", total_points: 75, action_count: 8 },
      { id: "3", username: "User Three", total_points: 50, action_count: 5 },
    ];

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((entry, index) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.total_points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.action_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded">
        Error loading leaderboard
      </div>
    );
  }
}

async function ActionLog() {
  try {
    // Mock data instead of fetching from API
    const data = [
      {
        id: "1",
        username: "User One",
        type: "github_commit",
        points: 10,
        created_at: "2023-06-01T12:00:00Z",
        description: "Committed to main branch",
      },
      {
        id: "2",
        username: "User Two",
        type: "github_pull_request",
        points: 25,
        created_at: "2023-06-01T11:30:00Z",
        description: "Created PR #123",
      },
      {
        id: "3",
        username: "User Three",
        type: "github_issue",
        points: 5,
        created_at: "2023-06-01T10:45:00Z",
        description: "Opened issue #456",
      },
    ];

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
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded">
        Error loading action log
      </div>
    );
  }
}
