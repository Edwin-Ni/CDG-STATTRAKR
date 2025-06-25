import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET() {
  try {
    // Get most recent quests
    const { data, error } = await supabase
      .from("quests")
      .select("*, users(username)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching quests:", error);
      return NextResponse.json(
        { error: "Failed to fetch quest data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error in quests route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, username, type, xp, description } = body;

    // Validate required fields
    if (!user_id || !username || !type || !xp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new quest
    const { data: quest, error: questError } = await supabase
      .from("quests")
      .insert({
        user_id,
        username,
        source: "manual",
        type,
        xp,
        description: description || "",
      })
      .select()
      .single();

    if (questError) {
      console.error("Error creating quest:", questError);
      return NextResponse.json(
        { error: "Failed to create quest" },
        { status: 500 }
      );
    }

    // Update the user's total XP and quest count
    const { error: userError } = await supabase.rpc(
      "increment_user_stats_with_levelup",
      {
        p_user_id: user_id,
        p_xp: xp,
      }
    );

    if (userError) {
      console.error("Error updating user stats:", userError);
      // Continue despite this error, as the quest was created
    }

    return NextResponse.json({ data: quest }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in quests POST route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
