"use client";

import { useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { createAction, getUserById } from "../lib/db";

type ActionType =
  | "github_commit"
  | "github_pr_opened"
  | "github_pr_merged"
  | "github_pr_review";

// Updated point values based on the provided table
const actionPoints = {
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

export default function ActionForm() {
  const [type, setType] = useState<ActionType>("github_commit");
  const [tag, setTag] = useState<TagType>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPoints, setSuccessPoints] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const authUser = await getCurrentUser();

      if (!authUser) {
        setError("You must be logged in to submit an action");
        setLoading(false);
        return;
      }

      // Get the complete user profile from the database to get the username
      const userProfile = await getUserById(authUser.id);

      // Calculate total points (base action points + tag points if any)
      const basePoints = actionPoints[type];
      const additionalPoints = tag ? tagPoints[tag] : 0;
      const totalPoints = basePoints + additionalPoints;

      // Include tag in description if selected
      const fullDescription = tag ? `${description} #${tag}` : description;

      await createAction({
        user_id: authUser.id,
        username: userProfile.username,
        type,
        points: totalPoints,
        description: fullDescription,
      });

      setSuccessPoints(totalPoints);
      setSuccess(true);
      setDescription("");
      setType("github_commit");
      setTag("");
    } catch (err) {
      setError("Failed to submit action. Please try again.");
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
            onChange={(e) => setType(e.target.value as ActionType)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-2 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit Quest"}
        </button>
      </form>
    </div>
  );
}
