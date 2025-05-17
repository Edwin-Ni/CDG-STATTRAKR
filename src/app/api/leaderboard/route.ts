import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real implementation, you'd fetch this from Supabase
    // const { data, error } = await supabase
    //   .from('users')
    //   .select('id, username, total_points, action_count')
    //   .order('total_points', { ascending: false });

    // if (error) throw error;

    // Mock data for now
    const data = [
      { id: "1", username: "User One", total_points: 100, action_count: 10 },
      { id: "2", username: "User Two", total_points: 75, action_count: 8 },
      { id: "3", username: "User Three", total_points: 50, action_count: 5 },
    ];

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
