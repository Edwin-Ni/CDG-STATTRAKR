import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real implementation, you'd fetch this from Supabase
    // const { data, error } = await supabase
    //   .from('actions')
    //   .select('id, user_id, type, points, metadata, created_at, users(username)')
    //   .order('created_at', { ascending: false })
    //   .limit(10);

    // if (error) throw error;

    // Mock data for now
    const data = [
      {
        id: "1",
        username: "User One",
        type: "github_commit",
        points: 10,
        created_at: "2023-06-01T12:00:00Z",
        description: "Committed to main branch",
      },
      {
        id: "2",
        username: "User Two",
        type: "github_pull_request",
        points: 25,
        created_at: "2023-06-01T11:30:00Z",
        description: "Created PR #123",
      },
      {
        id: "3",
        username: "User Three",
        type: "github_issue",
        points: 5,
        created_at: "2023-06-01T10:45:00Z",
        description: "Opened issue #456",
      },
    ];

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching actions:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions" },
      { status: 500 }
    );
  }
}
