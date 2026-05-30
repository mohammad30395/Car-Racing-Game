import { Button } from "@/components/ui/Button";
import type { GameStatus, GroundConfig, LevelConfig, PlayerProfile } from "@/types/game";

interface GameHUDProps {
  profile: PlayerProfile;
  ground: GroundConfig;
  level: LevelConfig;
  score: number;
  elapsed: number;
  lives: number;
  status: GameStatus;
  onPauseToggle: () => void;
  onExit: () => void;
}

export function GameHUD({
  profile,
  ground,
  level,
  score,
  elapsed,
  lives,
  status,
  onPauseToggle,
  onExit,
}: GameHUDProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-slate-950/75 p-2 text-white shadow-2xl backdrop-blur-xl sm:grid-cols-7">
      <HudItem label="Score" value={Math.round(score).toString()} />
      <HudItem label="Level" value={level.level.toString()} />
      <HudItem label="Chances" value={lives.toString()} />
      <HudItem label="Ground" value={ground.name} />
      <HudItem label="Player" value={`${profile.name} / ${profile.username}`} />
      <HudItem label="Time" value={`${elapsed.toFixed(1)}s`} />
      <div className="flex items-center justify-end gap-2">
        <Button disabled={status === "recovering"} onClick={onPauseToggle} size="sm" variant="secondary">
          {status === "paused" ? "Resume" : status === "recovering" ? "Wait" : "Pause"}
        </Button>
        <Button onClick={onExit} size="sm" variant="ghost">
          Exit
        </Button>
      </div>
    </div>
  );
}

function HudItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-white/[0.06] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="truncate text-sm font-black tracking-normal text-white">{value}</p>
    </div>
  );
}
