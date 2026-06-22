"use client";

import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[var(--surface)] border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors duration-200 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] appearance-none cursor-pointer",
            error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/50" : undefined,
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
