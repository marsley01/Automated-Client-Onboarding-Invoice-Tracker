import { cn, getStatusLabel } from "@/lib/utils";
import type { JobStatus } from "@/types";

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusStyles: Record<JobStatus, string> = {
  received: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  diagnosed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  quality_check: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  ready: "bg-green-500/10 text-green-400 border-green-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border", statusStyles[status], className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
        "bg-blue-400": status === "received",
        "bg-purple-400": status === "diagnosed",
        "bg-amber-400": status === "in_progress",
        "bg-cyan-400": status === "quality_check",
        "bg-green-400": status === "ready",
        "bg-emerald-400": status === "delivered",
        "bg-red-400": status === "cancelled",
      })} />
      {getStatusLabel(status)}
    </span>
  );
}
