import type { Level, LevelUp } from "../types/database";

interface LevelUpNotificationProps {
  levelUp: LevelUp & { level_info: Level };
  onClaim: (id: string) => void;
}

export default function LevelUpNotification({
  levelUp,
  onClaim,
}: LevelUpNotificationProps) {
  const { level_info } = levelUp;

  return (
    <div className="bg-[#ffce63] text-[#1e1f2e] p-4 rounded-md border-2 border-[#ffce63] shadow-lg">
      <div className="flex flex-col sm:items-center sm:justify-center">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-xl font-bold pixel-font truncate">
              🎉 LEVEL UP!
            </h3>
            <p className="pixel-font font-semibold">
              Level {levelUp.level}: {level_info.title}
            </p>
            {level_info.coin_reward > 0 && (
              <p className="pixel-font text-sm font-bold">
                Reward: {level_info.coin_reward} coins!
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onClaim(levelUp.id)}
          className="mt-4 bg-[#1e1f2e] text-[#ffce63] border-2 border-[#1e1f2e] px-4 py-2 rounded-md hover:bg-[#262840] pixel-font font-bold"
        >
          CLAIM
        </button>
      </div>
    </div>
  );
}
