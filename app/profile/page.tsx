import GitHubConnector from "../../components/GitHubConnector";
import LogOutButton from "../../components/LogOutButton";
import ProfileSettings from "../../components/ProfileSettings";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#1e1f2e] min-h-screen py-8 px-6">
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#7eb8da] uppercase tracking-wider pixel-font">
              Your Profile
            </h1>
            <LogOutButton />
          </div>

          <ProfileSettings />

          <GitHubConnector />

          <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg">
            <h3 className="text-xl font-bold text-[#7eb8da] mb-4 uppercase tracking-wider pixel-font">
              GitHub Webhook Setup for Admins
            </h3>

            <div className="space-y-3 text-[#ffffff] pixel-font">
              <div className="space-y-2 ml-4">
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">1.</div>
                  <div>Go to your GitHub repository's Settings</div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">2.</div>
                  <div>Click on "Webhooks" in the sidebar</div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">3.</div>
                  <div>Click "Add webhook"</div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">4.</div>
                  <div>Set Payload URL to the webhook URL shown above</div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">5.</div>
                  <div>Set Content type to "application/json"</div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">6.</div>
                  <div>
                    Select events: Push, Pull Requests, Issues, Issue Comments
                  </div>
                </div>
                <div className="flex">
                  <div className="text-[#ffce63] mr-2">7.</div>
                  <div>Click "Add webhook"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
