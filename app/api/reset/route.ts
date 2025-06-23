import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// This route should be protected and only accessible by admin/cron jobs
export async function POST() {
  try {
    // Reset the monthly points and action counts for all users without losing their data
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
    });
  } catch (error) {
    console.error("Unexpected error during monthly reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
