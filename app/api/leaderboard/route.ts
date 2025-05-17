import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET() {
  try {
    // Get all users ordered by total points
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("total_points", { ascending: false });

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard data" },
        { status: 500 }
      );
    }

    // Get the last reset date
    const { data: resetHistory, error: resetError } = await supabase
      .from("reset_history")
      .select("*")
      .order("reset_date", { ascending: false })
      .limit(1);

    if (resetError) {
      console.error("Error fetching reset history:", resetError);
    }

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const resetInfo = {
      lastReset:
        resetHistory && resetHistory.length > 0
          ? resetHistory[0].reset_date
          : new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      nextReset: nextMonth.toISOString(),
    };

    return NextResponse.json({
      data: users,
      resetInfo,
    });
  } catch (error) {
    console.error("Unexpected error in leaderboard route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
