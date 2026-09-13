"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "text";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:bg-primary-hover disabled:opacity-50",
  secondary:
    "bg-transparent text-ink border border-border hover:border-ink disabled:opacity-50",
  accent: "bg-accent text-white hover:brightness-95 disabled:opacity-50",
  text: "bg-transparent text-ink underline underline-offset-4 decoration-border hover:decoration-ink px-0",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  children,
  type = "button",
  disabled,
  loading,
  className,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200",
    variant !== "text" && "rounded-full",
    variant === "text" && "rounded-none px-0 py-1",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
      {loading ? "…" : children}
    </button>
  );
}
