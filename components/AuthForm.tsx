"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

type AuthMode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push("/");
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
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-6 shadow-lg">
      <div className="flex justify-between mb-6">
        <button
          className={`px-4 py-2 rounded-t-md text-lg pixel-font ${
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
          className={`px-4 py-2 rounded-t-md text-lg pixel-font ${
            mode === "signup"
              ? "bg-[#7eb8da] text-[#1e1f2e] font-bold"
              : "text-[#7eb8da]"
          }`}
          onClick={() => setMode("signup")}
          disabled={loading}
        >
          SIGN UP
        </button>
      </div>

      {error && (
        <div className="bg-[#e74c3c] text-white p-3 mb-4 rounded-md pixel-font">
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

        <button
          type="submit"
          className="w-full bg-[#ffce63] text-[#1e1f2e] border-2 border-[#ffce63] py-3 rounded-md hover:bg-[#e5b958] pixel-font text-lg"
          disabled={loading}
        >
          {loading
            ? "PROCESSING..."
            : mode === "login"
            ? "LOGIN"
            : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={toggleMode}
          className="text-[#7eb8da] hover:text-[#ffce63] pixel-font"
          disabled={loading}
        >
          {mode === "login"
            ? "Need an account? Sign up!"
            : "Already have an account? Login!"}
        </button>
      </div>
    </div>
  );
}
