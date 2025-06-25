"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { getUserById } from "../lib/db";
import { supabase } from "../lib/supabase";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUserById(user.id);
        if (userData.username) {
          setUsername(userData.username);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({ username: username })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
      <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
        Profile Settings
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">
            Username
          </label>
          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            required
            disabled={loading}
            placeholder="YourUsername"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-2 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
