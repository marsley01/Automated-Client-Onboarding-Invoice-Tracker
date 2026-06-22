import type { DailyRevenue } from "@/types";
import { formatKES } from "@/lib/utils";

interface RevenueChartProps {
  data: DailyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">
        No revenue data for the past 7 days
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const barWidth = Math.min(40, (100 / data.length) - 2);

  return (
    <div className="flex items-end gap-2 h-40 pt-4">
      {data.map((day, i) => {
        const height = (day.total / maxValue) * 100;
        const dayLabel = new Date(day.date).toLocaleDateString("en-KE", { weekday: "short" });

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {day.total > 0 ? formatKES(day.total) : ""}
            </span>
            <div
              className="w-full rounded-[4px] bg-gradient-to-t from-[var(--primary)] to-[var(--primary-hover)] transition-all duration-300 hover:opacity-80"
              style={{ height: `${Math.max(height, day.total > 0 ? 4 : 0)}%` }}
            />
            <span className="text-xs text-[var(--text-muted)]">{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
