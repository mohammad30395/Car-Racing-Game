"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/settings", label: "Settings" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link className="flex items-center gap-2 font-black tracking-normal text-white" href="/">
          <span className="h-3 w-8 rounded-full bg-cyan-300 shadow-glow" />
          Apex Lane
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                pathname === link.href && "bg-white/10 text-white",
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
