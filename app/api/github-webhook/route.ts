import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Updated XP values for different GitHub events based on the provided table
const XP_VALUES = {
  push: 1, // Commits (push event) - now 1 XP
  pull_request_opened: 5, // Opening a PR
  pull_request_merged: 8, // Merging a PR
  pull_request_review: 3, // PR review with approval
  issues: 3, // Issues
  issue_comment: 2, // Comments
};

// Tags for additional XP
const TAG_XP = {
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
    console.log("event", event);
    console.log("payload", payload);
    if (!event) {
      return NextResponse.json(
        {
          message: "Missing event type",
        },
        { status: 200 }
      );
    }

    let github_username = payload.sender.login || "";
    let description = "";
    let xp = 0;
    let questType = "";

    // Extract details based on event type
    switch (event) {
      case "push":
        const commitCount = payload.commits?.length || 1;
        xp = XP_VALUES.push * commitCount; // XP per commit
        description = `Pushed ${commitCount} commit(s) to ${payload.repository.name}`;
        questType = "github_commit";
        break;

      case "pull_request":
        const prAction = payload.action;

        if (prAction === "opened") {
          xp = XP_VALUES.pull_request_opened;
          questType = "github_pr_opened";
        } else if (prAction === "closed" && payload.pull_request?.merged) {
          xp = XP_VALUES.pull_request_merged;
          questType = "github_pr_merged";
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

        // Add tag XP and include tag in description
        if (tags.length > 0) {
          const tag = tags[0]; // Just use the first tag found
          if (TAG_XP[tag as keyof typeof TAG_XP]) {
            xp += TAG_XP[tag as keyof typeof TAG_XP];
            description += ` #${tag}`;
          }
        }
        break;

      case "issues":
        description = `${payload.action} issue #${payload.issue.number} in ${payload.repository.name}`;
        xp = XP_VALUES.issues;
        questType = "github_issue";
        break;

      case "issue_comment":
        description = `Commented on #${payload.issue.number} in ${payload.repository.name}`;
        xp = XP_VALUES.issue_comment;
        questType = "github_issue_comment";
        break;

      case "pull_request_review":
        const reviewState = payload.review?.state || "";
        if (reviewState === "approved") {
          xp = XP_VALUES.pull_request_review;
        } else {
          xp = 2;
        }
        description = `Reviewed PR #${payload.pull_request.number} in ${payload.repository.name}`;
        questType = "github_pr_review";
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
      .eq("github_username", github_username);

    if (userError || !users || users.length === 0) {
      console.error("User not found:", github_username);
      return NextResponse.json({ message: "User not found" }, { status: 200 });
    }

    const user = users[0];

    // Insert the new quest
    const { error: questError } = await supabase.from("quests").insert({
      user_id: user.id,
      username: github_username,
      source: "github",
      type: questType,
      xp: xp,
      description: description,
    });

    if (questError) {
      console.error("Error creating quest:", questError);
      return NextResponse.json(
        { message: "Error creating quest" },
        { status: 500 }
      );
    }

    // Update user stats
    const { error: updateError } = await supabase.rpc(
      "increment_user_stats_with_levelup",
      {
        p_user_id: user.id,
        p_xp: xp,
      }
    );

    if (updateError) {
      console.error("Error updating user stats:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: "Event processed successfully",
      event,
      xp,
      github_username,
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
