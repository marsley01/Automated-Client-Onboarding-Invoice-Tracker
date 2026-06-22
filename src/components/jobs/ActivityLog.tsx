import type { JobStatusHistory } from "@/types";
import { formatDateTime, getStatusLabel } from "@/lib/utils";

interface ActivityLogProps {
  history: JobStatusHistory[];
}

export default function ActivityLog({ history }: ActivityLogProps) {
  if (history.length === 0) {
    return <p className="text-sm text-[var(--text-muted)] text-center py-4">No activity yet</p>;
  }

  return (
    <div className="space-y-0">
      {[...history].reverse().map((entry, i) => {
        const isLast = i === history.length - 1;
        return (
          <div key={entry.id} className="relative flex gap-4 pb-4">
            {!isLast && (
              <div className="absolute left-[7px] top-4 bottom-0 w-px bg-[var(--border)]" />
            )}
            <div className="flex-shrink-0">
              <div className="w-[14px] h-[14px] rounded-full border-2 border-[var(--primary)] bg-[var(--primary-muted)] mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {entry.from_status ? `${getStatusLabel(entry.from_status as any)} → ${getStatusLabel(entry.to_status as any)}` : getStatusLabel(entry.to_status as any)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{formatDateTime(entry.created_at)}</span>
              </div>
              {entry.notes && (
                <p className="text-sm text-[var(--text-subtle)] mt-0.5">{entry.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
