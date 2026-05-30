import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";

const rules = [
  {
    title: "How to play",
    text: "Choose a player, ground, and unlocked level. Stay in your lane, dodge obstacles, and keep moving until you hit the target.",
  },
  {
    title: "Controls",
    text: "Desktop players can use Arrow Left, Arrow Right, A, and D to change lanes. Press Space or click the car to jump. Mobile players use the left and right touch buttons, and tap the car to jump.",
  },
  {
    title: "Chances",
    text: "Each race gives you three chances. A crash pauses the road briefly, clears traffic, and restarts your car if you still have a chance left.",
  },
  {
    title: "Scoring",
    text: "Score rises over time and scales with the selected level. Higher levels have stronger score multipliers.",
  },
  {
    title: "Level unlocks",
    text: "Level 1 starts unlocked. Winning a level unlocks the next level for the current username only.",
  },
  {
    title: "Game over",
    text: "The race ends immediately when your car collides with an obstacle.",
  },
  {
    title: "Winning",
    text: "You win by surviving the required time or reaching the level score target.",
  },
  {
    title: "Local saves",
    text: "Profiles, selected ground, progress, records, and leaderboard entries are saved in this browser with localStorage.",
  },
];

export default function RulesPage() {
  return (
    <PageLayout>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Rules</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Race system</h1>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {rules.map((rule) => (
          <Card key={rule.title}>
            <h2 className="text-xl font-black tracking-normal text-white">{rule.title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{rule.text}</p>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
