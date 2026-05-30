import { Suspense } from "react";

import { GamePageClient } from "@/components/game/GamePageClient";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-[100dvh] items-center justify-center overflow-hidden bg-slate-950 text-white">
          Loading race...
        </main>
      }
    >
      <GamePageClient />
    </Suspense>
  );
}
