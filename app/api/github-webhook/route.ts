import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Points for different GitHub events
const POINTS = {
  push: 5, // Commits (push event)
  pull_request: 10, // Pull requests
  issues: 3, // Issues
  issue_comment: 2, // Comments
  pull_request_review: 7, // Code reviews
};

export async function POST(req: Request) {
  try {
    // Verify GitHub webhook signature (optional but recommended)
    // const signature = req.headers.get("x-hub-signature-256");
    // const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    // Verify signature logic here...

    const payload = await req.json();
    const event = req.headers.get("x-github-event");

    if (!event || !Object.keys(POINTS).includes(event)) {
      return NextResponse.json(
        {
          message: "Unsupported event type",
        },
        { status: 200 }
      );
    }

    let username = "";
    let description = "";
    let points = POINTS[event as keyof typeof POINTS];

    // Extract details based on event type
    switch (event) {
      case "push":
        username = payload.sender.login;
        const commitCount = payload.commits?.length || 1;
        points = points * commitCount; // Points per commit
        description = `Pushed ${commitCount} commit(s) to ${payload.repository.name}`;
        break;

      case "pull_request":
        username = payload.sender.login;
        description = `${payload.action} PR #${payload.number} in ${payload.repository.name}`;
        break;

      case "issues":
        username = payload.sender.login;
        description = `${payload.action} issue #${payload.issue.number} in ${payload.repository.name}`;
        break;

      case "issue_comment":
        username = payload.sender.login;
        description = `Commented on #${payload.issue.number} in ${payload.repository.name}`;
        break;

      case "pull_request_review":
        username = payload.sender.login;
        description = `Reviewed PR #${payload.pull_request.number} in ${payload.repository.name}`;
        break;
    }

    // Find user by GitHub username
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);

    if (userError || !users || users.length === 0) {
      console.error("User not found:", username);
      return NextResponse.json({ message: "User not found" }, { status: 200 });
    }

    const user = users[0];

    // Insert the new action
    const { error: actionError } = await supabase.from("actions").insert({
      user_id: user.id,
      username: username,
      type: `github_${event}`,
      points: points,
      description: description,
    });

    if (actionError) {
      console.error("Error creating action:", actionError);
      return NextResponse.json(
        { message: "Error creating action" },
        { status: 500 }
      );
    }

    // Update user stats
    const { error: updateError } = await supabase.rpc("increment_user_stats", {
      p_user_id: user.id,
      p_points: points,
    });

    if (updateError) {
      console.error("Error updating user stats:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: "Event processed successfully",
      event,
      points,
      username,
      description,
    });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
