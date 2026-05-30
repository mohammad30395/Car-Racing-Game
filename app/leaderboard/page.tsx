"use client";

import { useEffect, useMemo, useState } from "react";

import { LeaderboardTable } from "@/components/LeaderboardTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { GROUNDS } from "@/lib/grounds";
import { getHighestUnlockedLevel, getLeaderboard } from "@/lib/storage";
import type { GameRecord } from "@/types/game";

export default function LeaderboardPage() {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [groundFilter, setGroundFilter] = useState("all");

  useEffect(() => {
    setRecords(getLeaderboard());
  }, []);

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => groundFilter === "all" || record.groundId === groundFilter)
      .map((record) => ({
        ...record,
        highestUnlockedLevel: getHighestUnlockedLevel(record.username),
      }))
      .sort((a, b) => b.score - a.score);
  }, [groundFilter, records]);

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Leaderboard</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Saved results</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Records are sorted by score and loaded from this browser only.
          </p>
        </div>
        <label className="block min-w-56">
          <span className="text-sm font-semibold text-slate-200">Ground filter</span>
          <select
            className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-200"
            onChange={(event) => setGroundFilter(event.target.value)}
            value={groundFilter}
          >
            <option value="all">All grounds</option>
            {GROUNDS.map((ground) => (
              <option key={ground.id} value={ground.id}>
                {ground.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8">
        {filteredRecords.length ? (
          <LeaderboardTable records={filteredRecords} />
        ) : (
          <Card>
            <h2 className="text-xl font-black tracking-normal text-white">No records yet</h2>
            <p className="mt-2 text-slate-300">
              Play a race to create your first local leaderboard entry.
            </p>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
