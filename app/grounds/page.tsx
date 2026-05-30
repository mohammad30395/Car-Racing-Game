"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { GroundCard } from "@/components/GroundCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { GROUNDS } from "@/lib/grounds";
import { getProfile, saveSelectedGroundId } from "@/lib/storage";
import type { GroundConfig } from "@/types/game";

export default function GroundsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getProfile()) {
      router.replace("/player");
    }
  }, [router]);

  function handleSelect(ground: GroundConfig) {
    saveSelectedGroundId(ground.id);
    router.push("/levels");
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Grounds</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Choose your road</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Each ground changes the road palette and racing feel while keeping progress tied to your
            username.
          </p>
        </div>
        <Button href="/player" variant="secondary">
          Edit Player
        </Button>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GROUNDS.map((ground) => (
          <GroundCard ground={ground} key={ground.id} onSelect={handleSelect} />
        ))}
      </div>
    </PageLayout>
  );
}
