import GitHubConnector from "../../components/GitHubConnector";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#1e1f2e] min-h-screen py-8 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-[#7eb8da] mb-6 uppercase tracking-wider pixel-font">
            Your Profile
          </h1>

          <GitHubConnector />

          <div className="mt-8 bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
            <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
              Webhook Setup Guide
            </h3>

            <div className="space-y-3 text-[#ffffff] pixel-font">
              <p>To track your GitHub contributions automatically:</p>

              <ol className="list-decimal ml-5 space-y-2">
                <li>Connect your GitHub username above</li>
                <li>Go to your GitHub repository's Settings</li>
                <li>Click on "Webhooks" in the sidebar</li>
                <li>Click "Add webhook"</li>
                <li>Set Payload URL to the webhook URL shown above</li>
                <li>Set Content type to "application/json"</li>
                <li>
                  Select events: Push, Pull Requests, Issues, Issue Comments
                </li>
                <li>Click "Add webhook"</li>
              </ol>

              <p className="mt-4 text-[#ffce63]">
                Your activities will now automatically earn XP in the game!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
