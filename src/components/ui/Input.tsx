"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-[var(--surface)] border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-200 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)]",
              icon ? "pl-10" : undefined,
              error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/50" : undefined,
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
