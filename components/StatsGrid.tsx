interface StatsGridProps {
  totalXp: number;
  questCount: number;
  coins: number;
}

export default function StatsGrid({
  totalXp,
  questCount,
  coins,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
      <div className="border-2 border-[#ffce63] rounded-md p-2 sm:p-3 text-center">
        <div className="text-xs sm:text-md text-[#ffce63] uppercase tracking-wider pixel-font">
          ⚡ <br /> XP
        </div>
        <div className="text-xl sm:text-3xl font-bold text-[#ffce63] pixel-font break-all">
          {totalXp.toLocaleString()}
        </div>
      </div>
      <div className="border-2 border-[#e74c3c] rounded-md p-2 sm:p-3 text-center hidden sm:block">
        <div className="text-xs sm:text-md text-[#e74c3c] uppercase tracking-wider pixel-font">
          📋 <br /> Quests
        </div>
        <div className="text-xl sm:text-3xl font-bold text-[#e74c3c] pixel-font">
          {questCount}
        </div>
      </div>
      <div className="border-2 border-[#ffce63] rounded-md p-2 sm:p-3 text-center">
        <div className="text-xs sm:text-md text-[#ffce63] uppercase tracking-wider pixel-font">
          💰 <br /> Coins
        </div>
        <div className="text-xl sm:text-3xl font-bold text-[#ffce63] pixel-font break-all">
          {coins.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
