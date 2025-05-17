import AuthForm from "../../components/AuthForm";

export default function AuthPage() {
  return (
    <div className="bg-[#1e1f2e] min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
            STATTRACK AK47
          </h1>
          <p className="text-[#ffce63] mt-2 pixel-font">
            JOIN THE QUEST • EARN XP • CONQUER THE LEADERBOARD
          </p>
        </div>

        <AuthForm />

        <div className="mt-8 text-center text-[#7eb8da] text-sm pixel-font">
          <p>Track your GitHub contributions in style!</p>
        </div>
      </div>
    </div>
  );
}
