import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, title, children, className }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-lg border border-white/15 bg-slate-950 p-5 text-white shadow-2xl",
          className,
        )}
        role="dialog"
      >
        <h2 className="text-2xl font-black tracking-normal">{title}</h2>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
