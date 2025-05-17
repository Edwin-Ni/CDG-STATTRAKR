import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Updated points for different GitHub events based on the provided table
const POINTS = {
  push: 1, // Commits (push event) - now 1 point
  pull_request_opened: 5, // Opening a PR
  pull_request_merged: 8, // Merging a PR
  pull_request_review: 3, // PR review with approval
  issues: 3, // Issues
  issue_comment: 2, // Comments
};

// Tags for additional points
const TAG_POINTS = {
  bug: 5,
  feature: 6,
  hotfix: 6,
  refactor: 4,
};

// Extract tags from description
function extractTags(description: string): string[] {
  const tagPattern = /#(bug|feature|hotfix|refactor)\b/gi;
  const matches = description.match(tagPattern) || [];
  return matches.map((tag) => tag.substring(1).toLowerCase());
}

export async function POST(req: Request) {
  try {
    // Verify GitHub webhook signature (optional but recommended)
    // const signature = req.headers.get("x-hub-signature-256");
    // const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    // Verify signature logic here...

    const payload = await req.json();
    const event = req.headers.get("x-github-event");

    if (!event) {
      return NextResponse.json(
        {
          message: "Missing event type",
        },
        { status: 200 }
      );
    }

    let username = "";
    let description = "";
    let points = 0;
    let actionType = "";

    // Extract details based on event type
    switch (event) {
      case "push":
        username = payload.sender.login;
        const commitCount = payload.commits?.length || 1;
        points = POINTS.push * commitCount; // Points per commit
        description = `Pushed ${commitCount} commit(s) to ${payload.repository.name}`;
        actionType = "github_commit";
        break;

      case "pull_request":
        username = payload.sender.login;
        const prAction = payload.action;

        if (prAction === "opened") {
          points = POINTS.pull_request_opened;
          actionType = "github_pr_opened";
        } else if (prAction === "closed" && payload.pull_request?.merged) {
          points = POINTS.pull_request_merged;
          actionType = "github_pr_merged";
        } else {
          return NextResponse.json(
            { message: "Unsupported PR action" },
            { status: 200 }
          );
        }

        description = `${prAction} PR #${payload.number} in ${payload.repository.name}`;

        // Check for tags in PR title or body
        const prTitle = payload.pull_request?.title || "";
        const prBody = payload.pull_request?.body || "";
        const fullText = `${prTitle} ${prBody}`;
        const tags = extractTags(fullText);

        // Add tag points and include tag in description
        if (tags.length > 0) {
          const tag = tags[0]; // Just use the first tag found
          if (TAG_POINTS[tag as keyof typeof TAG_POINTS]) {
            points += TAG_POINTS[tag as keyof typeof TAG_POINTS];
            description += ` #${tag}`;
          }
        }
        break;

      case "issues":
        username = payload.sender.login;
        description = `${payload.action} issue #${payload.issue.number} in ${payload.repository.name}`;
        points = POINTS.issues;
        actionType = "github_issue";
        break;

      case "issue_comment":
        username = payload.sender.login;
        description = `Commented on #${payload.issue.number} in ${payload.repository.name}`;
        points = POINTS.issue_comment;
        actionType = "github_issue_comment";
        break;

      case "pull_request_review":
        username = payload.sender.login;
        const reviewState = payload.review?.state || "";
        if (reviewState === "approved") {
          points = POINTS.pull_request_review;
        } else {
          points = 2; // Comment-only review gets 2 points
        }
        description = `Reviewed PR #${payload.pull_request.number} in ${payload.repository.name}`;
        actionType = "github_pr_review";
        break;

      default:
        return NextResponse.json(
          { message: "Unsupported event type" },
          { status: 200 }
        );
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
      type: actionType,
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
