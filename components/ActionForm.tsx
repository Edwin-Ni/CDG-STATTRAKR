"use client";

import { useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { createAction } from "../lib/db";

type ActionType =
  | "github_commit"
  | "github_pull_request"
  | "github_issue"
  | "github_code_review";

const actionPoints = {
  github_commit: 5,
  github_pull_request: 10,
  github_issue: 3,
  github_code_review: 7,
};

export default function ActionForm() {
  const [type, setType] = useState<ActionType>("github_commit");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError("You must be logged in to submit an action");
        setLoading(false);
        return;
      }

      await createAction({
        user_id: user.id,
        username: user.email || "Unknown User",
        type,
        points: actionPoints[type],
        description,
      });

      setSuccess(true);
      setDescription("");
      setType("github_commit");
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
          Quest logged successfully! +{actionPoints[type]} XP
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
            <option value="github_commit">GitHub Commit (+5 XP)</option>
            <option value="github_pull_request">Pull Request (+10 XP)</option>
            <option value="github_issue">Issue Report (+3 XP)</option>
            <option value="github_code_review">Code Review (+7 XP)</option>
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
