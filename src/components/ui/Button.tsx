"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variant === "primary" && "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-[0.97]",
          variant === "secondary" && "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300",
          variant === "ghost" && "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-zinc-100",
          variant === "danger" && "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
          size === "sm" && "px-4 py-2 text-xs gap-1.5",
          size === "md" && "px-5 py-2.5 text-sm gap-2",
          size === "lg" && "px-6 py-3 text-base gap-2.5",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
