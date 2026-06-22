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
    received: "bg-blue-50 text-blue-600 border-blue-200",
    diagnosed: "bg-purple-50 text-purple-600 border-purple-200",
    in_progress: "bg-amber-50 text-amber-600 border-amber-200",
    quality_check: "bg-cyan-50 text-cyan-600 border-cyan-200",
    ready: "bg-green-50 text-green-600 border-green-200",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return colors[status];
}

export function getPriorityColor(priority: JobPriority): string {
  const colors: Record<JobPriority, string> = {
    low: "bg-slate-50 text-slate-500 border-slate-200",
    normal: "bg-blue-50 text-blue-600 border-blue-200",
    high: "bg-orange-50 text-orange-600 border-orange-200",
    urgent: "bg-red-50 text-red-600 border-red-200",
  };
  return colors[priority];
}

export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-slate-50 text-slate-500 border-slate-200",
    sent: "bg-blue-50 text-blue-600 border-blue-200",
    partially_paid: "bg-amber-50 text-amber-600 border-amber-200",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
    overdue: "bg-red-50 text-red-600 border-red-200",
    cancelled: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return colors[status] || colors.draft;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    general: "General",
    consulting: "Consulting",
    design: "Design",
    development: "Development",
    marketing: "Marketing",
    writing: "Writing",
    financial: "Financial",
    legal: "Legal",
    repair: "Repair",
    maintenance: "Maintenance",
    cleaning: "Cleaning",
    photography: "Photography",
    education: "Education",
    health: "Health",
    logistics: "Logistics",
    event: "Event",
    other: "Other",
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

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-cyan-100 text-cyan-600",
  "bg-orange-100 text-orange-600",
  "bg-teal-100 text-teal-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
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
