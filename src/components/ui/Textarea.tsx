"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[var(--surface)] border border-[var(--border)] rounded-[8px] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-200 focus:outline-none focus:border-[var(--border-active)] focus:ring-1 focus:ring-[var(--border-active)] resize-vertical min-h-[80px]",
            error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/50" : undefined,
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
