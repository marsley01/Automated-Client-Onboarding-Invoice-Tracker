"use client";

import { cn, getStatusLabel } from "@/lib/utils";
import type { JobStatus, JobStatusHistory } from "@/types";

interface TrackingTimelineProps {
  currentStatus: JobStatus;
  history: JobStatusHistory[];
}

const timelineStatuses: JobStatus[] = [
  "received", "diagnosed", "in_progress", "quality_check", "ready", "delivered",
];

export default function TrackingTimeline({ currentStatus, history }: TrackingTimelineProps) {
  const currentIndex = timelineStatuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";
  const lastCancelledEntry = history.find((h) => h.to_status === "cancelled");

  return (
    <div className="space-y-0">
      {isCancelled && lastCancelledEntry && (
        <div className="flex gap-4 pb-6">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-[var(--error-muted)] border-2 border-[var(--error)] flex items-center justify-center">
              <svg className="w-2 h-2 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="w-px flex-1 bg-[var(--border)] mt-1" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--error)]">Cancelled</p>
            {lastCancelledEntry.notes && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{lastCancelledEntry.notes}</p>
            )}
          </div>
        </div>
      )}
      {timelineStatuses.slice(0, isCancelled ? currentIndex : currentIndex + 1).map((status, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const statusEntry = history.find((h) => h.to_status === status);

        return (
          <div key={status} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                isCompleted && "bg-[var(--success-muted)] border-[var(--success)]",
                isCurrent && !isCancelled && "bg-[var(--primary-muted)] border-[var(--primary)]",
                isCancelled && i === currentIndex && "bg-[var(--error-muted)] border-[var(--error)]",
              )}>
                {isCompleted ? (
                  <svg className="w-2.5 h-2.5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent && !isCancelled ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                ) : null}
              </div>
              {i < timelineStatuses.length - 1 && (
                <div className={cn(
                  "w-px flex-1 mt-1",
                  isCompleted ? "bg-[var(--success)]" : "bg-[var(--border)]"
                )} />
              )}
            </div>
            <div className="pb-4">
              <p className={cn(
                "text-sm font-medium",
                isCompleted && "text-[var(--success)]",
                isCurrent && !isCancelled && "text-[var(--text-primary)]",
                isCurrent && isCancelled && "text-[var(--error)]",
                !isCompleted && !isCurrent && "text-[var(--text-muted)]"
              )}>
                {getStatusLabel(status)}
              </p>
              {statusEntry?.notes && (
                <p className="text-sm text-[var(--text-subtle)] mt-0.5">{statusEntry.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
