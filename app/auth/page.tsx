import AuthForm from "../../components/AuthForm";

export default function AuthPage() {
  return (
    <div className="bg-[#1e1f2e] min-h-screen-minus-navbar flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
            CDG STATTRAKR
          </h1>
          <p className="text-[#ffce63] mt-2 pixel-font">
            JOIN THE GRIND • EARN XP • CONQUER THE LEADERBOARD
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}
