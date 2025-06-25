import type { Level } from "../types/database";

interface LevelProgressCardProps {
  level: number;
  currentLevelInfo: Level | null;
  xpToNext: number;
  progressPercentage: number;
}

export default function LevelProgressCard({
  level,
  currentLevelInfo,
  xpToNext,
  progressPercentage,
}: LevelProgressCardProps) {
  return (
    <div className="bg-[#1e1f2e] border-2 border-[#ffce63] rounded-md p-3 text-center">
      <div className="text-md text-[#ffce63] uppercase tracking-wider pixel-font">
        Level {level}
      </div>
      <div className="text-3xl font-bold text-[#ffce63] pixel-font">
        {currentLevelInfo?.title}
      </div>
      {xpToNext > 0 && (
        <>
          <div className="text-xs text-[#ffce63] pixel-font mt-1">
            {xpToNext} XP left
          </div>
          <div className="w-full bg-[#262840] rounded-full h-2 mt-2">
            <div
              className="bg-[#ffce63] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}
