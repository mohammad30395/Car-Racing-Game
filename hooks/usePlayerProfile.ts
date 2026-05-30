"use client";

import { useCallback, useEffect, useState } from "react";

import { getProfile, saveProfile } from "@/lib/storage";
import { normalizeUsername } from "@/lib/utils";
import type { PlayerProfile } from "@/types/game";

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setLoaded(true);
  }, []);

  const updateProfile = useCallback((nextProfile: PlayerProfile) => {
    saveProfile(nextProfile);
    setProfile({
      name: nextProfile.name.trim(),
      username: normalizeUsername(nextProfile.username),
    });
  }, []);

  return { profile, loaded, updateProfile };
}
