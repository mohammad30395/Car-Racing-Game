import type { GroundConfig } from "@/types/game";

export const GROUNDS: GroundConfig[] = [
  {
    id: "city",
    name: "City Road",
    description: "Tight lanes, cool asphalt, and downtown light streaks.",
    difficulty: "Balanced",
    accent: "#2dd4bf",
    road: "#1f2937",
    lane: "#e5e7eb",
    background: "from-slate-950 via-zinc-900 to-cyan-950",
    obstacle: "#f97316",
  },
  {
    id: "desert",
    name: "Desert Highway",
    description: "Warm horizon, dusty shoulders, and long open straights.",
    difficulty: "Steady",
    accent: "#f59e0b",
    road: "#3f3f46",
    lane: "#fde68a",
    background: "from-stone-950 via-amber-950 to-zinc-950",
    obstacle: "#fb7185",
  },
  {
    id: "snow",
    name: "Snow Track",
    description: "Icy contrast, pale markings, and sharper visibility.",
    difficulty: "Technical",
    accent: "#93c5fd",
    road: "#334155",
    lane: "#f8fafc",
    background: "from-slate-950 via-sky-950 to-indigo-950",
    obstacle: "#38bdf8",
  },
  {
    id: "neon",
    name: "Neon Night",
    description: "High contrast road glow with arcade-night energy.",
    difficulty: "Fast",
    accent: "#f472b6",
    road: "#111827",
    lane: "#67e8f9",
    background: "from-black via-fuchsia-950 to-cyan-950",
    obstacle: "#a78bfa",
  },
  {
    id: "forest",
    name: "Forest Road",
    description: "Deep green shoulders, clean lanes, and changing pace.",
    difficulty: "Flowing",
    accent: "#22c55e",
    road: "#27272a",
    lane: "#bbf7d0",
    background: "from-zinc-950 via-emerald-950 to-slate-950",
    obstacle: "#ef4444",
  },
];

export function getGroundById(id: string | null | undefined) {
  return GROUNDS.find((ground) => ground.id === id) ?? GROUNDS[0];
}
