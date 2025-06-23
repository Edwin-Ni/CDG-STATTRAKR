import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET() {
  try {
    // Get all levels ordered by level number
    const { data: levels, error: levelsError } = await supabase
      .from("levels")
      .select("*")
      .order("level", { ascending: true });

    if (levelsError) {
      console.error("Error fetching levels:", levelsError);
      return NextResponse.json(
        { error: "Failed to fetch levels" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: levels,
    });
  } catch (error) {
    console.error("Unexpected error in levels route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
