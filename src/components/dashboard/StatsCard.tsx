import Card from "@/components/ui/Card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  secondary?: string;
}

export default function StatsCard({ title, value, icon, secondary }: StatsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">{title}</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{value}</p>
          {secondary && <p className="text-xs text-[var(--text-subtle)] mt-0.5">{secondary}</p>}
        </div>
        <div className="p-2 rounded-md bg-[var(--primary-muted)] text-[var(--primary)]">
          {icon}
        </div>
      </div>
    </Card>
  );
}
