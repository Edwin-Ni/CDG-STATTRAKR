"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../lib/authContext";

export default function LogOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <button
      onClick={handleSignOut}
      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-3 py-1 rounded-md pixel-font text-sm"
    >
      LOGOUT
    </button>
  );
}
