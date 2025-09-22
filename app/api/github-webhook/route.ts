import { NextResponse } from "next/server";
import { QUEST_XP, TAG_XP, extractTags } from "../../../lib/questConfig";
import { supabaseAdmin } from "../../../lib/supabase-server";

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

    let github_username = payload.sender.login || "";
    let description = "";
    let xp = 0;
    let questType = "";

    // Extract details based on event type
    switch (event) {
      case "push":
        xp = QUEST_XP.github_commit;
        description = `Pushed to ${payload.repository.name}`;
        questType = "github_commit";
        break;

      case "pull_request": {
        const prAction = payload.action;
        const pr = payload.pull_request;

        if (!pr) {
          return NextResponse.json(
            { message: "Missing pull request data" },
            { status: 200 }
          );
        }

        if (prAction === "opened") {
          xp = QUEST_XP.github_pr_opened;
          questType = "github_pr_opened";
          github_username = pr.user.login;
          description = `Opened PR #${payload.number} in ${payload.repository.name}`;
        } else if (prAction === "closed" && pr.merged) {
          xp = QUEST_XP.github_pr_merged;
          questType = "github_pr_merged";
          github_username = pr.user.login; // Assign XP to the PR author
          description = `Merged PR #${payload.number} in ${payload.repository.name}`;
        } else {
          return NextResponse.json(
            { message: "Unsupported PR action or not merged" },
            { status: 200 }
          );
        }

        // Check for tags in PR title or body (ONLY for pull requests)
        const prTitle = pr.title || "";
        const prBody = pr.body || "";
        const fullText = `${prTitle} ${prBody}`;
        const tags = extractTags(fullText);

        // Add tag XP and include tag in description
        if (tags.length > 0) {
          const tag = tags[0]; // Just use the first tag found
          if (tag !== "" && TAG_XP[tag]) {
            xp += TAG_XP[tag];
            description += ` #${tag}`;
          }
        }
        break;
      }

      case "pull_request_review":
        const reviewState = payload.review?.state || "";

        // Only award XP for actual reviews (approved, changes_requested, or dismissed)
        // Skip simple comments which have state "commented"
        if (reviewState === "commented" || reviewState === "dismissed") {
          xp = 1;
        } else {
          xp = QUEST_XP.github_pr_review;
        }

        description = `Reviewed PR #${payload.pull_request.number} in ${payload.repository.name} (${reviewState})`;
        questType = "github_pr_review";
        break;

      default:
        return NextResponse.json(
          { message: "Unsupported event type" },
          { status: 200 }
        );
    }

    // Find user by GitHub username
    const { data: users, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("github_username", github_username);

    if (userError || !users || users.length === 0) {
      console.error("User not found:", github_username);
      return NextResponse.json({ message: "User not found" }, { status: 200 });
    }

    const user = users[0];

    // Insert the new quest
    const { error: questError } = await supabaseAdmin.from("quests").insert({
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
    const { error: updateError } = await supabaseAdmin.rpc(
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
