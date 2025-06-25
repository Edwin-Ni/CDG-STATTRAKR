"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { getUserById } from "../lib/db";
import { supabase } from "../lib/supabase";

export default function GitHubConnector() {
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth();

  // Fetch existing GitHub username on component load
  useEffect(() => {
    const fetchCurrentGitHubUsername = async () => {
      if (!user?.id) {
        setInitialLoading(false);
        return;
      }

      try {
        const userData = await getUserById(user.id);
        if (userData.github_username) {
          setGithubUsername(userData.github_username);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Don't show error for this, just continue with empty field
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCurrentGitHubUsername();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("You must be logged in to connect GitHub");
      setLoading(false);
      return;
    }

    try {
      // Update user record with GitHub username
      const { error: updateError } = await supabase
        .from("users")
        .update({ github_username: githubUsername })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setGithubUsername("");
    } catch (err: any) {
      setError(err.message || "Failed to connect GitHub account");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
        <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
          Connect GitHub Account
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-[#7eb8da] pixel-font">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
      <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
        Connect GitHub Account
      </h3>

      {success && (
        <div className="bg-[#2ecc71] text-white p-3 mb-4 rounded-md pixel-font">
          GitHub username connected successfully!
        </div>
      )}

      {error && (
        <div className="bg-[#e74c3c] text-white p-3 mb-4 rounded-md pixel-font">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">
            GitHub Username
          </label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            required
            disabled={loading}
            placeholder="YourGitHubUsername"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-2 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect GitHub"}
        </button>
      </form>

      <div className="mt-4 text-[#7eb8da] text-sm pixel-font">
        <p>
          If you are the repo admin, ensure this webhook is added to your GitHub
          repositories:
        </p>
        <div className="bg-[#262840] p-2 mt-2 rounded-md overflow-x-auto">
          <code className="text-[#ffce63]">
            {typeof window !== "undefined"
              ? `${window.location.origin}/api/github-webhook`
              : "[Your App URL]/api/github-webhook"}
          </code>
        </div>
      </div>
    </div>
  );
}
