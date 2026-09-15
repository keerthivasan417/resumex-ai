import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "outline" | "success" | "warning";
}

export function Badge({
  className,
  variant = "brand",
  ...props
}: BadgeProps) {
  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    brand:
      "bg-brand-50 text-brand-700 border-brand-200/80 font-medium",
    neutral:
      "bg-zinc-100 text-zinc-700 border-zinc-200 font-medium",
    outline:
      "bg-transparent text-zinc-700 border-zinc-300 font-medium",
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
