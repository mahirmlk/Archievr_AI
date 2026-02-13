import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProgressStats } from "@/types/roadmap";

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function AnalyticsPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";

  const [topics, progress] = await Promise.all([
    prisma.topic.findMany({
      where: { phase: { roadmap: { userId } } },
      include: { phase: true },
      orderBy: [{ phase: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
  ]);

  const totalTopics = topics.length;
  const completedTopics = progress.filter((row) => row.status === "completed" || row.status === "mastered").length;
  const inProgressTopics = progress.filter((row) => row.status === "in_progress").length;
  const notStartedTopics = Math.max(totalTopics - completedTopics - inProgressTopics, 0);
  const overallCompletion = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const phaseTotals = new Map<string, { phaseId: string; title: string; total: number; completed: number; percent: number }>();
  for (const topic of topics) {
    const current = phaseTotals.get(topic.phase.id) ?? {
      phaseId: topic.phase.id,
      title: topic.phase.title,
      total: 0,
      completed: 0,
      percent: 0,
    };
    current.total += 1;
    phaseTotals.set(topic.phase.id, current);
  }

  for (const row of progress) {
    if (row.status !== "completed" && row.status !== "mastered") continue;
    const current = phaseTotals.get(row.topic.phase.id);
    if (current) current.completed += 1;
  }

  const phaseBreakdown = Array.from(phaseTotals.values()).map((phase) => ({
    ...phase,
    percent: phase.total ? Math.round((phase.completed / phase.total) * 100) : 0,
  }));

  const stats: ProgressStats = {
    totalTopics,
    completedTopics,
    inProgressTopics,
    notStartedTopics,
    overallCompletion,
    phaseBreakdown,
  };

  const activityMap = new Map<string, number>();
  for (const row of progress) {
    const dates = [row.startedAt, row.completedAt, row.updatedAt, row.lastAccessedAt].filter((value): value is Date => Boolean(value));
    for (const date of dates) {
      const key = dayKey(date);
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
    }
  }

  const activities = Array.from(activityMap.entries()).map(([date, count]) => ({ date, count }));

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Progress breakdown, phase completion, and activity trends.</p>
      </div>
      <StatsCards stats={stats} />
      <div className="grid gap-4 xl:grid-cols-2">
        <ProgressChart stats={stats} />
        <ActivityHeatmap activities={activities} />
      </div>
      <section className="grid gap-3">
        {phaseBreakdown.map((phase) => (
          <Card key={phase.phaseId}>
            <div className="mb-2 flex items-center justify-between">
              <CardTitle>{phase.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {phase.completed}/{phase.total}
              </p>
            </div>
            <Progress value={phase.percent} />
            <p className="mt-2 text-sm">{phase.percent}% complete</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
