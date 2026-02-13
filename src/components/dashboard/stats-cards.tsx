import { Card } from "@/components/ui/card";
import type { ProgressStats } from "@/types/roadmap";

export function StatsCards({ stats }: { stats: ProgressStats | null }) {
  const items = [
    { label: "Overall Completion", value: `${stats?.overallCompletion ?? 0}%` },
    { label: "Completed Topics", value: `${stats?.completedTopics ?? 0}` },
    { label: "In Progress", value: `${stats?.inProgressTopics ?? 0}` },
    { label: "Total Topics", value: `${stats?.totalTopics ?? 0}` },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-sm text-neutral-400">{item.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{item.value}</p>
        </Card>
      ))}
    </section>
  );
}
