import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Don't cache this route

function getResetDates() {
  const now = new Date();

  // Last reset: first day of current month
  const lastReset = new Date(now.getFullYear(), now.getMonth(), 1);

  // Next reset: first day of next month
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    lastReset: lastReset.toISOString(),
    nextReset: nextReset.toISOString(),
  };
}

export async function GET() {
  try {
    // Mock data for now - will be replaced with Supabase fetch
    const data = [
      { id: "1", username: "User One", total_points: 100, action_count: 10 },
      { id: "2", username: "User Two", total_points: 75, action_count: 8 },
      { id: "3", username: "User Three", total_points: 50, action_count: 5 },
    ];

    // Add reset information
    const resetInfo = getResetDates();

    // Add a slight delay to simulate a real API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      data,
      resetInfo,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
