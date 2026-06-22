import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export default function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variant === "default" && "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--border-active)]",
        variant === "success" && "bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/20",
        variant === "warning" && "bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/20",
        variant === "error" && "bg-[var(--error-muted)] text-[var(--error)] border-[var(--error)]/20",
        variant === "info" && "bg-blue-500/10 text-blue-400 border-blue-500/20",
        className
      )}
    >
      {children}
    </span>
  );
}
