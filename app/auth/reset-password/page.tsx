"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/authContext";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const router = useRouter();
  const { updatePassword, user } = useAuth();

  useEffect(() => {
    // Check if this is a password reset link by looking for the recovery type in the URL hash
    const checkResetLink = () => {
      if (typeof window !== "undefined") {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const type = hashParams.get("type");

        if (type === "recovery") {
          setValidLink(true);
        } else if (user) {
          // User is already logged in, they can still change their password
          setValidLink(true);
        } else {
          setError("Invalid reset link. Please request a new password reset.");
        }
      }
    };

    checkResetLink();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your password");
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="bg-[#1e1f2e] min-h-screen-minus-navbar flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
              CDG STATTRAKR
            </h1>
            <p className="text-[#ffce63] mt-2 pixel-font">INVALID RESET LINK</p>
          </div>

          <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-6 shadow-lg text-center">
            {error && (
              <div className="bg-[#e74c3c] text-white p-4 mb-4 rounded-md pixel-font">
                {error}
              </div>
            )}
            <button
              onClick={() => router.push("/auth")}
              className="bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-3 px-6 rounded-md hover:bg-[#e5b958] pixel-font"
            >
              REQUEST NEW RESET
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#1e1f2e] min-h-screen-minus-navbar flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
              CDG STATTRAKR
            </h1>
            <p className="text-[#ffce63] mt-2 pixel-font">
              PASSWORD UPDATED SUCCESSFULLY!
            </p>
          </div>

          <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-6 shadow-lg text-center">
            <div className="bg-[#27ae60] text-white p-4 mb-4 rounded-md pixel-font">
              Your password has been updated! Redirecting to dashboard...
            </div>
            <div className="text-[#7eb8da] pixel-font">
              <div className="animate-pulse">LOADING...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1f2e] min-h-screen-minus-navbar flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
            CDG STATTRAKR
          </h1>
          <p className="text-[#ffce63] mt-2 pixel-font">
            SET YOUR NEW PASSWORD
          </p>
        </div>

        <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="text-xl text-[#7eb8da] pixel-font">
              RESET PASSWORD
            </h2>
          </div>

          {error && (
            <div className="bg-[#e74c3c] text-white p-3 mb-4 rounded-md pixel-font">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#7eb8da] mb-2 pixel-font">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
                required
                disabled={loading}
                minLength={6}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-[#7eb8da] mb-2 pixel-font">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
                required
                disabled={loading}
                minLength={6}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-3 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
              disabled={loading}
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/auth")}
              className="text-[#7eb8da] hover:text-[#ffce63] pixel-font"
              disabled={loading}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
