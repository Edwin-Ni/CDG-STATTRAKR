import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// This route should be protected and only accessible by admin/cron jobs
export async function POST() {
  try {
    // Get the current date
    const now = new Date();
    const resetDate = now.toISOString();

    // 1. Record the reset in the reset_history table
    const { error: resetError } = await supabase
      .from("reset_history")
      .insert({ reset_date: resetDate });

    if (resetError) {
      console.error("Error recording reset history:", resetError);
      return NextResponse.json(
        { error: "Failed to record reset history" },
        { status: 500 }
      );
    }

    // 2. Reset the monthly points and action counts for all users without losing their data
    // We'll use a stored procedure/function for this to ensure it's done atomically
    const { error: resetUserError } = await supabase.rpc("reset_monthly_stats");

    if (resetUserError) {
      console.error("Error resetting user stats:", resetUserError);
      return NextResponse.json(
        { error: "Failed to reset user stats" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Monthly reset completed successfully",
      resetDate,
    });
  } catch (error) {
    console.error("Unexpected error during monthly reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
