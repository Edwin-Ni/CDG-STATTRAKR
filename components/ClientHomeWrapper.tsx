"use client";

import { Suspense, lazy } from "react";

// Lazy load components
const LeaderboardClient = lazy(() => import("./LeaderboardClient"));
const ActionLogClient = lazy(() => import("./ActionLogClient"));

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

export default function ClientHomeWrapper() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardClient />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Actions</h2>
        <Suspense fallback={<ActionLogSkeleton />}>
          <ActionLogClient />
        </Suspense>
      </section>
    </div>
  );
}
