"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/authContext";
import { createQuest, getUserById } from "../lib/db";
import {
  MANUAL_QUEST_TYPES,
  ManualQuestType,
  QUEST_XP,
  TAG_DISPLAY,
  TAG_XP,
  TagType,
  getQuestDisplayName,
  getQuestXP,
} from "../lib/questConfig";

interface QuestFormProps {
  onQuestCreated?: () => void | Promise<void>;
}

export default function QuestForm({ onQuestCreated }: QuestFormProps) {
  const [type, setType] = useState<ManualQuestType>("github_commit");
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

      // Calculate total points using centralized config
      const totalPoints = getQuestXP(type, tag);

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
            onChange={(e) => setType(e.target.value as ManualQuestType)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            disabled={loading || refreshPending}
          >
            {MANUAL_QUEST_TYPES.map((questType) => (
              <option key={questType} value={questType}>
                {getQuestDisplayName(questType)} (+{QUEST_XP[questType]} XP)
              </option>
            ))}
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
            {(Object.keys(TAG_DISPLAY) as Array<keyof typeof TAG_DISPLAY>).map(
              (tagType) => (
                <option key={tagType} value={tagType}>
                  {TAG_DISPLAY[tagType].name} (+{TAG_XP[tagType]} XP)
                </option>
              )
            )}
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
