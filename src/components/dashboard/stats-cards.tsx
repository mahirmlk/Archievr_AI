import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProgressStats } from "@/types/roadmap";

export function StatsCards({ stats }: { stats: ProgressStats | null }) {
  const items = [
    { label: "Overall Completion", value: `${stats?.overallCompletion ?? 0}%`, showBar: true },
    { label: "Completed", value: `${stats?.completedTopics ?? 0}` },
    { label: "In Progress", value: `${stats?.inProgressTopics ?? 0}` },
    { label: "Total Topics", value: `${stats?.totalTopics ?? 0}` },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5 transition-all duration-200 hover:border-neutral-700">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {item.label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {item.value}
          </p>
          {item.showBar && (
            <div className="mt-3">
              <Progress value={stats?.overallCompletion ?? 0} className="h-1.5" />
            </div>
          )}
        </Card>
      ))}
    </section>
  );
}
