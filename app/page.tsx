import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLayout } from "@/components/layout/PageLayout";

export default function HomePage() {
  return (
    <PageLayout contentClassName="flex min-h-[calc(100dvh-72px)] items-center">
      <section className="relative grid w-full items-center gap-8 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="racing-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
            Frontend-only racing
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-normal text-white sm:text-6xl lg:text-7xl">
            Apex Lane
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Pick a road, master each level, dodge traffic, and keep every score saved in your
            browser.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button href="/player" size="lg">
              Play
            </Button>
            <Button href="/rules" size="lg" variant="secondary">
              Rules
            </Button>
            <Button href="/settings" size="lg" variant="secondary">
              Settings
            </Button>
            <Button href="/leaderboard" size="lg" variant="secondary">
              Leaderboard
            </Button>
          </div>
        </div>
        <Card className="relative z-10 hidden min-h-[420px] overflow-hidden p-0 md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-cyan-950" />
          <div className="absolute inset-x-16 bottom-0 top-0 bg-zinc-800 shadow-2xl">
            <div className="absolute inset-y-0 left-1/3 w-1 border-l border-dashed border-cyan-100/80" />
            <div className="absolute inset-y-0 right-1/3 w-1 border-l border-dashed border-cyan-100/80" />
          </div>
          <div className="absolute bottom-12 left-1/2 h-24 w-14 -translate-x-1/2 rounded-t-2xl rounded-b-lg bg-cyan-300 shadow-glow">
            <div className="mx-auto mt-3 h-7 w-8 rounded-md bg-slate-950/70" />
            <div className="absolute -left-2 bottom-4 h-7 w-3 rounded bg-slate-950" />
            <div className="absolute -right-2 bottom-4 h-7 w-3 rounded bg-slate-950" />
          </div>
          <div className="absolute left-[30%] top-16 h-16 w-11 rounded-lg bg-rose-500 shadow-danger" />
          <div className="absolute right-[28%] top-48 h-20 w-12 rounded-lg bg-amber-400" />
        </Card>
      </section>
    </PageLayout>
  );
}
