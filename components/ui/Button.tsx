"use client";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size = "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white active:bg-brand-dark border-transparent",
  secondary: "bg-white text-ink border-slate-300 active:bg-slate-100",
  danger: "bg-rojo text-white active:brightness-90 border-transparent",
  success: "bg-verde text-white active:brightness-90 border-transparent",
  ghost: "bg-transparent text-brand border-transparent active:bg-slate-100",
};
const SIZES: Record<Size, string> = {
  md: "min-h-12 px-4 text-base",
  lg: "min-h-14 px-5 text-lg",
  xl: "min-h-16 px-6 text-xl",
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex touch-target items-center justify-center gap-2 rounded-xl border font-semibold",
        "transition-colors disabled:opacity-50 disabled:pointer-events-none select-none",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
    />
  );
}
