"use client";

import { useCallback, useEffect, useState } from "react";

import { getProgress, saveProgress } from "@/lib/storage";
import type { GameProgress } from "@/types/game";

export function useGameProgress(username?: string | null) {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) {
      setProgress(null);
      setLoaded(true);
      return;
    }

    setProgress(getProgress(username));
    setLoaded(true);
  }, [username]);

  const updateProgress = useCallback((nextProgress: GameProgress) => {
    saveProgress(nextProgress);
    setProgress(nextProgress);
  }, []);

  return { progress, loaded, updateProgress };
}
