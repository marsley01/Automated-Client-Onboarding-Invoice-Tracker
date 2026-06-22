"use client";

import { motion } from "motion/react";
import { cn, getStatusLabel, getValidNextStatuses } from "@/lib/utils";
import type { JobStatus } from "@/types";

interface StatusStepperProps {
  currentStatus: JobStatus;
  onUpdateClick?: () => void;
}

const allStatuses: JobStatus[] = [
  "received", "diagnosed", "in_progress", "quality_check", "ready", "delivered",
];

export default function StatusStepper({ currentStatus, onUpdateClick }: StatusStepperProps) {
  const currentIndex = allStatuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";
  const validNext = getValidNextStatuses(currentStatus);
  const canUpdate = validNext.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-0">
        {allStatuses.map((status, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isUpcoming = i > currentIndex;

          return (
            <div key={status} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  isCompleted && "bg-[var(--success-muted)] border-[var(--success)] text-[var(--success)]",
                  isCurrent && !isCancelled && "bg-[var(--primary-muted)] border-[var(--primary)] text-[var(--primary)] ring-4 ring-[var(--primary-muted)]",
                  isCurrent && isCancelled && "bg-[var(--error-muted)] border-[var(--error)] text-[var(--error)]",
                  isUpcoming && "bg-transparent border-[var(--border)] text-[var(--text-muted)]"
                )}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium whitespace-nowrap",
                  isCompleted && "text-[var(--success)]",
                  isCurrent && !isCancelled && "text-[var(--primary)]",
                  isCurrent && isCancelled && "text-[var(--error)]",
                  isUpcoming && "text-[var(--text-muted)]"
                )}>
                  {getStatusLabel(status)}
                </span>
              </div>
              {i < allStatuses.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-1 mt-[-1.5rem]",
                  i < currentIndex ? "bg-[var(--success)]" : "bg-[var(--border)]"
                )} />
              )}
            </div>
          );
        })}
      </div>
      {canUpdate && !isCancelled && (
        <div className="text-center">
          <button
            onClick={onUpdateClick}
            className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
          >
            Update Status &rarr;
          </button>
        </div>
      )}
      {isCancelled && (
        <div className="text-center">
          <span className="text-sm text-[var(--error)] font-medium">This job has been cancelled</span>
        </div>
      )}
    </div>
  );
}
