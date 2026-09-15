import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none rounded-md";

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default:
        "bg-brand-600 text-white hover:bg-brand-700 shadow-sm border border-transparent active:bg-brand-800",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-transparent active:bg-zinc-300",
      outline:
        "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100",
      ghost:
        "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
      link:
        "text-brand-600 underline-offset-4 hover:underline p-0 h-auto font-normal",
    };

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
