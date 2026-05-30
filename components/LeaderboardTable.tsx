import { formatDate } from "@/lib/utils";
import type { GameRecord } from "@/types/game";

interface LeaderboardTableProps {
  records: Array<GameRecord & { highestUnlockedLevel: number }>;
}

export function LeaderboardTable({ records }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.06]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Best score</th>
              <th className="px-4 py-3">Highest level</th>
              <th className="px-4 py-3">Ground</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {records.map((record, index) => (
              <tr className="text-slate-200" key={record.id}>
                <td className="px-4 py-3 font-black text-white">#{index + 1}</td>
                <td className="px-4 py-3 font-semibold text-cyan-200">{record.username}</td>
                <td className="px-4 py-3">{record.name}</td>
                <td className="px-4 py-3 font-black text-white">{record.score}</td>
                <td className="px-4 py-3">{record.highestUnlockedLevel}</td>
                <td className="px-4 py-3">{record.groundName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(record.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold">
                    {record.status === "win" ? "Win" : "Game Over"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
