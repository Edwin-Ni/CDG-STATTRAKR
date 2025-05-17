import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Don't cache this route

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    // Mock historical data
    const historicalData = [
      {
        year: 2023,
        month: 5,
        leaderboard: [
          {
            username: "Past Winner",
            total_points: 150,
            action_count: 12,
            rank: 1,
          },
          {
            username: "Runner Up",
            total_points: 120,
            action_count: 10,
            rank: 2,
          },
          {
            username: "Third Place",
            total_points: 90,
            action_count: 8,
            rank: 3,
          },
        ],
      },
      {
        year: 2023,
        month: 6,
        leaderboard: [
          {
            username: "June Winner",
            total_points: 200,
            action_count: 15,
            rank: 1,
          },
          {
            username: "June Second",
            total_points: 180,
            action_count: 12,
            rank: 2,
          },
          {
            username: "June Third",
            total_points: 120,
            action_count: 10,
            rank: 3,
          },
        ],
      },
    ];

    // Filter by year and month if provided
    let data = [...historicalData];

    if (year) {
      data = data.filter((item) => item.year === parseInt(year));
    }

    if (month) {
      data = data.filter((item) => item.month === parseInt(month));
    }

    // Add a slight delay to simulate a real API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
