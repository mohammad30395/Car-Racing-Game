"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GameCanvas } from "@/components/game/GameCanvas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getLevelConfig } from "@/lib/gameConfig";
import { getGroundById } from "@/lib/grounds";
import { getProfile, getProgress, getSelectedGroundId } from "@/lib/storage";
import type { GroundConfig, LevelConfig, PlayerProfile } from "@/types/game";

export function GamePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [ground, setGround] = useState<GroundConfig | null>(null);
  const [level, setLevel] = useState<LevelConfig | null>(null);
  const [message, setMessage] = useState("Loading race...");

  useEffect(() => {
    const savedProfile = getProfile();
    const selectedGroundId = getSelectedGroundId();
    const levelNumber = Number(searchParams.get("level") ?? "1");
    const selectedLevel = getLevelConfig(Number.isFinite(levelNumber) ? levelNumber : 1);

    if (!savedProfile) {
      setMessage("Create a player profile before racing.");
      return;
    }

    if (!selectedGroundId) {
      setMessage("Choose a ground before racing.");
      return;
    }

    const progress = getProgress(savedProfile.username);
    if (!progress.unlockedLevels.includes(selectedLevel.level)) {
      router.replace("/levels");
      return;
    }

    setProfile(savedProfile);
    setGround(getGroundById(selectedGroundId));
    setLevel(selectedLevel);
  }, [router, searchParams]);

  if (!profile || !ground || !level) {
    return (
      <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
        <Card className="max-w-md text-center">
          <h1 className="text-2xl font-black tracking-normal">Race unavailable</h1>
          <p className="mt-3 text-slate-300">{message}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href="/player">Player</Button>
            <Button href="/grounds" variant="secondary">
              Grounds
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className={`no-scroll-game bg-gradient-to-br ${ground.background} p-2 text-white md:p-4`}>
      <GameCanvas key={`${ground.id}-${level.level}`} ground={ground} level={level} profile={profile} />
    </main>
  );
}
