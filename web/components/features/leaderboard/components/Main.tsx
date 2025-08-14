import { useLeaderboardData } from "../provider";
import { leaderboardColumns } from "../variables/leaderboardColumns";
import { DataTable } from "./DataTable";
import Top1To3Card from "./Top1To3";

export default function MainLeaderboard() {
  const { leaderboardData, totalParticipants } = useLeaderboardData();
  const top4To10 = leaderboardData.slice(3, 10);
  const top1To3 = leaderboardData.slice(0, 3);

  return (
    <main className="py-16 px-6 lg:px-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
          Leaderboard - Top 10 Inviters
        </h1>
        <h3 className="text-lg font-medium text-gray-400">
          From{" "}
          <span className="text-yellow-300 font-bold text-2xl animate-bounce">
            {totalParticipants.toLocaleString()}
          </span>{" "}
          Participants
        </h3>
      </div>

      {/* Top 3 Cards */}
      <Top1To3Card data={top1To3} />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        <span className="text-gray-400 uppercase tracking-widest text-sm">
          Ranks 4 - 10
        </span>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>

      {/* Table */}
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700">
        <DataTable columns={leaderboardColumns} data={top4To10} />
      </div>
    </main>
  );
}
