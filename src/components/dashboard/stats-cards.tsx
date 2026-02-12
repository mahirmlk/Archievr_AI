import { Card } from "@/components/ui/card";
import type { ProgressStats } from "@/types/roadmap";

export function StatsCards({ stats }: { stats: ProgressStats | null }) {
  const items = [
    { label: "Overall Completion", value: `${stats?.overallCompletion ?? 0}%` },
    { label: "Completed Topics", value: `${stats?.completedTopics ?? 0}` },
    { label: "Total Topics", value: `${stats?.totalTopics ?? 0}` },
  ];
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-[var(--muted)]">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold">{item.value}</p>
        </Card>
      ))}
    </section>
  );
}
