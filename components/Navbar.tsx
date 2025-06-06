"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { getUserById } from "../lib/db";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [usernameLoading, setUsernameLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.id) {
        setUsernameLoading(true);
        try {
          const userData = await getUserById(user.id);
          setUsername(userData.username);
        } catch (error) {
          console.error("Error fetching username:", error);
          // Fallback to email if username fetch fails
          setUsername(user.email?.split("@")[0] || "User");
        } finally {
          setUsernameLoading(false);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <nav className="bg-[#1e1f2e] border-b-2 border-[#3d3f5a] py-3 px-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#e74c3c] pixel-font">
          <div className="sm:hidden">CDG</div>
          <div className="hidden sm:block">CDG STATTRAKR</div>
        </Link>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-3 w-20 bg-[#3d3f5a] rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-[#ffce63] hover:text-[#e5b958] pixel-font hidden sm:block"
              >
                {usernameLoading ? (
                  <div className="h-3 w-20 bg-[#3d3f5a] rounded-full animate-pulse"></div>
                ) : (
                  username
                )}
              </Link>
              <Link
                href="/profile"
                className="bg-[#7eb8da] hover:bg-[#5a9bbd] text-[#1e1f2e] px-3 py-1 rounded-md pixel-font text-sm"
              >
                PROFILE
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-[#7eb8da] hover:bg-[#5a9bbd] text-[#1e1f2e] px-3 py-1 rounded-md pixel-font text-sm"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
