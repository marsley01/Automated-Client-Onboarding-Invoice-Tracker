import { format, parseISO } from "date-fns";
import type { JobStatus, JobPriority } from "@/types";

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy HH:mm");
}

export function generateJobNumber(counter: number): string {
  return `JOB-${String(counter).padStart(4, "0")}`;
}

export function generateInvoiceNumber(prefix: string, counter: number): string {
  return `${prefix}-${counter}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: JobStatus): string {
  const colors: Record<JobStatus, string> = {
    received: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    diagnosed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    quality_check: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    ready: "bg-green-500/10 text-green-400 border-green-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return colors[status];
}

export function getPriorityColor(priority: JobPriority): string {
  const colors: Record<JobPriority, string> = {
    low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    normal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return colors[priority];
}

export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    partially_paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    paid: "bg-green-500/10 text-green-400 border-green-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return colors[status] || colors.draft;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    repair: "Repair",
    design: "Design",
    development: "Development",
    consulting: "Consulting",
    general: "General",
  };
  return labels[category] || category;
}

export function getStatusLabel(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    received: "Received",
    diagnosed: "Diagnosed",
    in_progress: "In Progress",
    quality_check: "Quality Check",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status];
}

export function getValidNextStatuses(status: JobStatus): JobStatus[] {
  const flow: Record<JobStatus, JobStatus[]> = {
    received: ["diagnosed", "cancelled"],
    diagnosed: ["in_progress", "cancelled"],
    in_progress: ["quality_check", "cancelled"],
    quality_check: ["ready", "in_progress", "cancelled"],
    ready: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };
  return flow[status];
}

type ClassValue = string | boolean | number | bigint | undefined | null | Record<string, boolean | undefined | null>;

export function cn(...classes: ClassValue[]): string {
  return classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === "string") return [c];
      if (typeof c === "object") {
        return Object.entries(c)
          .filter(([, v]) => v)
          .map(([k]) => k);
      }
      return [];
    })
    .join(" ");
}
