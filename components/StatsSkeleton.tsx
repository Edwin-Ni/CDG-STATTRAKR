export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-[#1e1f2e] border-2 border-[#3d3f5a] rounded-md p-3 text-center animate-pulse"
        >
          <div className="h-4 bg-[#3d3f5a] rounded mb-2"></div>
          <div className="h-8 bg-[#3d3f5a] rounded"></div>
        </div>
      ))}
    </div>
  );
}
