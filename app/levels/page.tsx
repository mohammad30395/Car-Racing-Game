"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LevelCard } from "@/components/LevelCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LEVELS } from "@/lib/gameConfig";
import { getGroundById } from "@/lib/grounds";
import { getProfile, getProgress, getSelectedGroundId } from "@/lib/storage";
import type { GameProgress, PlayerProfile } from "@/types/game";

export default function LevelsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [groundId, setGroundId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = getProfile();
    if (!savedProfile) {
      router.replace("/player");
      return;
    }

    const selectedGround = getSelectedGroundId();
    if (!selectedGround) {
      router.replace("/grounds");
      return;
    }

    setProfile(savedProfile);
    setGroundId(selectedGround);
    setProgress(getProgress(savedProfile.username));
  }, [router]);

  const ground = getGroundById(groundId);

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Levels</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">
            {ground.name} challenge
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Win a level to unlock the next one. Level 1 is always available for every username.
          </p>
        </div>
        <div className="flex gap-3">
          <Button href="/grounds" variant="secondary">
            Change Ground
          </Button>
          <Button href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>

      {message ? (
        <Card className="mt-6 border-amber-300/30 bg-amber-300/10 text-amber-100">
          {message}
        </Card>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {LEVELS.map((level) => {
          const unlocked = Boolean(progress?.unlockedLevels.includes(level.level));

          return (
            <LevelCard
              bestScore={progress?.bestScores[String(level.level)]}
              key={level.level}
              level={level}
              onLocked={() =>
                setMessage(`Win level ${level.level - 1} before racing level ${level.level}.`)
              }
              onSelect={(selectedLevel) => router.push(`/game?level=${selectedLevel.level}`)}
              unlocked={unlocked}
            />
          );
        })}
      </div>

      {!profile || !progress ? (
        <p className="mt-6 text-sm text-slate-400">Loading saved progress...</p>
      ) : null}
    </PageLayout>
  );
}
