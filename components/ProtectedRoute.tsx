"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/authContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-[#1e1f2e] min-h-screen flex items-center justify-center">
        <div className="bg-[#262840] p-6 rounded-md shadow-lg border-2 border-[#7eb8da]">
          <div className="flex flex-col items-center">
            <div className="text-2xl text-[#ffce63] pixel-font">LOADING...</div>
            <div className="mt-4 w-32 h-4 bg-[#3d3f5a] rounded-full overflow-hidden">
              <div className="h-full bg-[#7eb8da] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // We'll redirect in the useEffect hook
  }

  return <>{children}</>;
}
