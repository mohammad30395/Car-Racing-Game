"use client";

import { FormEvent, useEffect, useState } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { clearAllGameData, getProfile, resetProgress, saveProfile } from "@/lib/storage";
import { normalizeUsername } from "@/lib/utils";
import type { PlayerProfile } from "@/types/game";

export default function SettingsPage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = getProfile();
    setProfile(saved);
    if (saved) {
      setName(saved.name);
      setUsername(saved.username);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextProfile = {
      name: name.trim(),
      username: normalizeUsername(username),
    };

    if (!nextProfile.name || !nextProfile.username) {
      setMessage("Name and username are required.");
      return;
    }

    saveProfile(nextProfile);
    setProfile(nextProfile);
    setUsername(nextProfile.username);
    setMessage("Profile updated. Future records will use this username.");
  }

  function handleResetProgress() {
    const current = profile;
    if (!current) {
      setMessage("Create a profile before resetting progress.");
      return;
    }

    if (window.confirm(`Reset progress for ${current.username}? Records will stay saved.`)) {
      resetProgress(current.username);
      setMessage("Current user progress reset to level 1.");
    }
  }

  function handleClearAll() {
    if (window.confirm("Clear all Apex Lane local data from this browser?")) {
      clearAllGameData();
      setProfile(null);
      setName("");
      setUsername("");
      setMessage("All local game data was cleared.");
    }
  }

  return (
    <PageLayout>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Settings</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Player profile</h1>
          <p className="mt-3 leading-7 text-slate-300">
            Existing records stay attached to the username that created them. New races use the
            current saved username.
          </p>
          <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Current saved profile
            </p>
            <p className="mt-2 text-lg font-black text-white">{profile?.name ?? "No profile"}</p>
            <p className="text-sm text-cyan-200">{profile?.username ?? "Create one to save progress"}</p>
          </div>
        </Card>

        <Card>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Name</span>
              <input
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-200"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Username</span>
              <input
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-200"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button fullWidth type="submit">
                Save
              </Button>
              <Button fullWidth onClick={handleResetProgress} variant="secondary">
                Reset Progress
              </Button>
              <Button fullWidth onClick={handleClearAll} variant="danger">
                Clear All
              </Button>
            </div>
          </form>
          {message ? <p className="mt-5 text-sm text-cyan-100">{message}</p> : null}
        </Card>
      </div>
    </PageLayout>
  );
}
