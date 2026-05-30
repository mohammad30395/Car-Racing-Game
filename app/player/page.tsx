"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProfile, saveProfile } from "@/lib/storage";
import { normalizeUsername } from "@/lib/utils";

export default function PlayerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setName(profile.name);
      setUsername(profile.username);
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    const cleanName = name.trim();
    const cleanUsername = normalizeUsername(username);

    if (!cleanName) {
      nextErrors.name = "Enter your player name.";
    }

    if (!cleanUsername) {
      nextErrors.username = "Choose a username for saved records.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    saveProfile({ name: cleanName, username: cleanUsername });
    router.push("/grounds");
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-xl">
        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Player</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Save your driver</h1>
          <p className="mt-2 text-slate-300">
            Your name and username are stored locally and used to connect progress to your profile.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Name</span>
              <input
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-200"
                onChange={(event) => setName(event.target.value)}
                placeholder="Alex Racer"
                value={name}
              />
              {errors.name ? <p className="mt-2 text-sm text-rose-300">{errors.name}</p> : null}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Username</span>
              <input
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-200"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="alex123"
                value={username}
              />
              <p className="mt-2 text-xs text-slate-500">
                Saved as lowercase. Spaces become hyphens.
              </p>
              {errors.username ? (
                <p className="mt-2 text-sm text-rose-300">{errors.username}</p>
              ) : null}
            </label>
            <Button fullWidth size="lg" type="submit">
              Continue
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
