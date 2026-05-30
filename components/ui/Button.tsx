import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-300 text-slate-950 shadow-glow hover:bg-cyan-200 focus-visible:ring-cyan-200",
  secondary:
    "border border-white/15 bg-white/10 text-white hover:border-white/25 hover:bg-white/15 focus-visible:ring-white/50",
  ghost: "text-slate-200 hover:bg-white/10 focus-visible:ring-white/40",
  danger:
    "bg-rose-500 text-white shadow-danger hover:bg-rose-400 focus-visible:ring-rose-200",
  success:
    "bg-emerald-400 text-emerald-950 shadow-glow hover:bg-emerald-300 focus-visible:ring-emerald-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-normal transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} type="button" {...props}>
      {children}
    </button>
  );
}
