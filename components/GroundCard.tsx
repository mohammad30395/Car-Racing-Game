import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { GroundConfig } from "@/types/game";

interface GroundCardProps {
  ground: GroundConfig;
  onSelect: (ground: GroundConfig) => void;
}

export function GroundCard({ ground, onSelect }: GroundCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">
      <div className={`h-28 bg-gradient-to-br ${ground.background} relative`}>
        <div
          className="absolute inset-x-10 bottom-0 top-0 skew-x-[-7deg] border-x border-white/10"
          style={{ backgroundColor: ground.road }}
        >
          <div
            className="mx-auto h-full w-1 border-x border-dashed opacity-80"
            style={{ borderColor: ground.lane }}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-normal text-white">{ground.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{ground.description}</p>
          </div>
          <span
            className="rounded-full border px-3 py-1 text-xs font-bold"
            style={{ borderColor: `${ground.accent}66`, color: ground.accent }}
          >
            {ground.difficulty}
          </span>
        </div>
        <Button className="mt-5" fullWidth onClick={() => onSelect(ground)} variant="secondary">
          Select
        </Button>
      </div>
    </Card>
  );
}
