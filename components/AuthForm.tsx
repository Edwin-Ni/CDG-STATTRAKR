"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

type AuthMode = "login" | "signup" | "reset";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        router.push("/");
      } else if (mode === "signup") {
        await signUp(email, password);
        router.push("/");
      } else if (mode === "reset") {
        await resetPassword(email);
        setError(
          "Password reset email sent! Check your inbox for instructions."
        );
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 sm:p-6 shadow-lg">
      <div className="flex justify-between mb-6">
        <button
          className={`px-4 py-2 rounded-md text-sm pixel-font ${
            mode === "login"
              ? "bg-[#7eb8da] text-[#1e1f2e] font-bold"
              : "text-[#7eb8da]"
          }`}
          onClick={() => setMode("login")}
          disabled={loading}
        >
          LOGIN
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm pixel-font ${
            mode === "signup"
              ? "bg-[#7eb8da] text-[#1e1f2e] font-bold"
              : "text-[#7eb8da]"
          }`}
          onClick={() => setMode("signup")}
          disabled={loading}
        >
          SIGN UP
        </button>
        {/* <button
          className={`px-3 py-2 rounded-md text-sm pixel-font ${
            mode === "reset"
              ? "bg-[#7eb8da] text-[#1e1f2e] font-bold"
              : "text-[#7eb8da]"
          }`}
          onClick={() => setMode("reset")}
          disabled={loading}
        >
          RESET
        </button> */}
      </div>

      {mode === "reset" && !error && (
        <div className="bg-[#3d3f5a] text-[#7eb8da] p-3 mb-4 rounded-md pixel-font text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </div>
      )}

      {error && (
        <div
          className={`p-3 mb-4 rounded-md pixel-font ${
            error.includes("Password reset email sent")
              ? "bg-[#27ae60] text-white"
              : "bg-[#e74c3c] text-white"
          }`}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#7eb8da] mb-2 pixel-font">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
            required
            disabled={loading}
          />
        </div>

        {mode !== "reset" && (
          <div>
            <label className="block text-[#7eb8da] mb-2 pixel-font">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#262840] text-white border-2 border-[#7eb8da] rounded-md p-2 pixel-font"
              required
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-3 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading}
        >
          {loading
            ? "PROCESSING..."
            : mode === "login"
            ? "LOGIN"
            : mode === "signup"
            ? "CREATE ACCOUNT"
            : "SEND RESET EMAIL"}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        {mode === "reset" ? (
          <button
            onClick={() => setMode("login")}
            className="text-[#7eb8da] hover:text-[#ffce63] pixel-font"
            disabled={loading}
          >
            Remember your password? Login!
          </button>
        ) : (
          <>
            {/* <button
              onClick={toggleMode}
              className="text-[#7eb8da] hover:text-[#ffce63] pixel-font block w-full"
              disabled={loading}
            >
              {mode === "login"
                ? "Need an account? Sign up!"
                : "Already have an account? Login!"}
            </button> */}
            <button
              onClick={() => setMode("reset")}
              className="text-[#ffce63] hover:text-[#7eb8da] pixel-font text-sm"
              disabled={loading}
            >
              Forgot your password?
            </button>
          </>
        )}
      </div>
    </div>
  );
}
