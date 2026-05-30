import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LevelConfig } from "@/types/game";

interface LevelCardProps {
  level: LevelConfig;
  unlocked: boolean;
  bestScore?: number;
  onSelect: (level: LevelConfig) => void;
  onLocked: () => void;
}

export function LevelCard({ level, unlocked, bestScore, onSelect, onLocked }: LevelCardProps) {
  return (
    <Card className={unlocked ? "flex flex-col" : "flex flex-col opacity-55"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Level {level.level}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-normal">
            {unlocked ? "Unlocked" : "Locked"}
          </h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-lg font-black">
          {unlocked ? level.level : "L"}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div>
          <dt className="text-slate-500">Target</dt>
          <dd className="font-semibold text-white">{level.winScoreTarget}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Survive</dt>
          <dd className="font-semibold text-white">{level.requiredSurvivalTime}s</dd>
        </div>
        <div>
          <dt className="text-slate-500">Traffic</dt>
          <dd className="font-semibold text-white">{level.obstacleCount}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Best</dt>
          <dd className="font-semibold text-white">{bestScore ?? 0}</dd>
        </div>
      </dl>
      <Button
        className="mt-5"
        fullWidth
        onClick={() => (unlocked ? onSelect(level) : onLocked())}
        variant={unlocked ? "primary" : "secondary"}
      >
        {unlocked ? "Race" : "Locked"}
      </Button>
    </Card>
  );
}
