import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET() {
  try {
    // Get all users ordered by monthly XP
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("monthly_xp", { ascending: false });

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: users,
    });
  } catch (error) {
    console.error("Unexpected error in leaderboard route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
