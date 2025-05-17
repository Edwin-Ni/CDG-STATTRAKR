import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET() {
  try {
    // Get most recent actions
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching actions:", error);
      return NextResponse.json(
        { error: "Failed to fetch action data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error in actions route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, username, type, points, description } = body;

    // Validate required fields
    if (!user_id || !username || !type || !points) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new action
    const { data: action, error: actionError } = await supabase
      .from("actions")
      .insert({
        user_id,
        username,
        type,
        points,
        description: description || "",
      })
      .select()
      .single();

    if (actionError) {
      console.error("Error creating action:", actionError);
      return NextResponse.json(
        { error: "Failed to create action" },
        { status: 500 }
      );
    }

    // Update the user's total points and action count
    const { error: userError } = await supabase.rpc("increment_user_stats", {
      p_user_id: user_id,
      p_points: points,
    });

    if (userError) {
      console.error("Error updating user stats:", userError);
      // Continue despite this error, as the action was created
    }

    return NextResponse.json({ data: action }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in actions POST route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
