import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({ children, className, contentClassName }: PageLayoutProps) {
  return (
    <main
      className={cn(
        "min-h-[100dvh] overflow-x-hidden bg-slate-950 text-white",
        "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(248,113,113,0.14),transparent_28rem)]",
        className,
      )}
    >
      <Navbar />
      <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10", contentClassName)}>
        {children}
      </div>
    </main>
  );
}
