"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/authContext";
import { createQuest, getUserById } from "../lib/db";

type QuestType =
  | "github_commit"
  | "github_pr_opened"
  | "github_pr_merged"
  | "github_pr_review";

// Updated point values based on the provided table
const questPoints = {
  github_commit: 1,
  github_pr_opened: 5,
  github_pr_merged: 8,
  github_pr_review: 3, // Using the higher value for PR review with approval
};

// Tags for additional points
type TagType = "bug" | "feature" | "hotfix" | "refactor" | "";

const tagPoints = {
  bug: 5,
  feature: 6,
  hotfix: 6,
  refactor: 4,
  "": 0,
};

interface QuestFormProps {
  onQuestCreated?: () => void | Promise<void>;
}

export default function QuestForm({ onQuestCreated }: QuestFormProps) {
  const [type, setType] = useState<QuestType>("github_commit");
  const [tag, setTag] = useState<TagType>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPoints, setSuccessPoints] = useState(0);
  const [refreshPending, setRefreshPending] = useState(false);

  // Effect to handle auto-refresh after success
  useEffect(() => {
    if (refreshPending) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 second delay to show success message

      return () => clearTimeout(timer);
    }
  }, [refreshPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setRefreshPending(false);

    try {
      const authUser = await getCurrentUser();

      if (!authUser) {
        setError("You must be logged in to submit a quest");
        setLoading(false);
        return;
      }

      // Get the complete user profile from the database to get the username
      const userProfile = await getUserById(authUser.id);

      // Calculate total points (base quest points + tag points if any)
      const basePoints = questPoints[type];
      const additionalPoints = tag ? tagPoints[tag] : 0;
      const totalPoints = basePoints + additionalPoints;

      // Include tag in description if selected
      const fullDescription = tag ? `${description} #${tag}` : description;

      await createQuest({
        user_id: authUser.id,
        username: userProfile.username,
        source: "manual",
        type,
        xp: totalPoints,
        description: fullDescription,
      });

      setSuccessPoints(totalPoints);
      setSuccess(true);
      setDescription("");
      setType("github_commit");
      setTag("");

      // Call the callback to refresh parent data
      if (onQuestCreated) {
        await onQuestCreated();
      } else {
        setRefreshPending(true); // Fallback to page refresh if no callback
      }
    } catch (err) {
      setError("Failed to submit quest. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
      <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
        Log New Quest
      </h3>

      {success && (
        <div className="bg-[#2ecc71] text-white p-3 rounded-md mb-4 pixel-font">
          Quest logged successfully! +{successPoints} XP
          {refreshPending && <span className="ml-2">Refreshing...</span>}
        </div>
      )}

      {error && (
        <div className="bg-[#e74c3c] text-white p-3 rounded-md mb-4 pixel-font">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">
            Quest Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestType)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            disabled={loading || refreshPending}
          >
            <option value="github_commit">Commit (+1 XP)</option>
            <option value="github_pr_opened">PR Opened (+5 XP)</option>
            <option value="github_pr_merged">PR Merged (+8 XP)</option>
            <option value="github_pr_review">PR Review (+3 XP)</option>
          </select>
        </div>

        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">
            Tag (Optional)
          </label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as TagType)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            disabled={loading || refreshPending}
          >
            <option value="">No Tag</option>
            <option value="bug">Bug Fix (+5 XP)</option>
            <option value="feature">Feature (+6 XP)</option>
            <option value="hotfix">Hotfix (+6 XP)</option>
            <option value="refactor">Refactor (+4 XP)</option>
          </select>
        </div>

        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            rows={3}
            placeholder="Describe your quest..."
            disabled={loading || refreshPending}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-2 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading || refreshPending}
        >
          {loading
            ? "Processing..."
            : refreshPending
            ? "Refreshing..."
            : "Submit Quest"}
        </button>
      </form>
    </div>
  );
}
