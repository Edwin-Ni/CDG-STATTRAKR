import type { Level, LevelUp } from "../types/database";

interface LevelUpNotificationProps {
  levelUp: LevelUp & { level_info: Level };
  onClaim: (id: string) => void;
  totalCount?: number;
}

export default function LevelUpNotification({
  levelUp,
  onClaim,
  totalCount = 1,
}: LevelUpNotificationProps) {
  const { level_info } = levelUp;

  return (
    <div className="bg-[#ffce63] text-[#1e1f2e] p-4 rounded-md border-2 border-[#ffce63] shadow-lg relative">
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
            {totalCount > 1 && (
              <p className="pixel-font text-xs text-[#1e1f2e] opacity-75 mt-1">
                +{totalCount - 1} more level{totalCount > 2 ? "s" : ""} to claim
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onClaim(levelUp.id)}
          className="mt-4 bg-[#1e1f2e] text-[#ffce63] border-2 border-[#1e1f2e] px-4 py-2 rounded-md hover:bg-[#262840] pixel-font font-bold transition-colors"
        >
          CLAIM
        </button>
      </div>
    </div>
  );
}
