import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";

  const [roadmaps, progressRows, topicCount] = await Promise.all([
    prisma.roadmap.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
    prisma.topic.count({ where: { phase: { roadmap: { userId } } } }),
  ]);

  const completed = progressRows.filter((p) => p.status === "completed" || p.status === "mastered").length;
  const overallCompletion = topicCount ? Math.round((completed / topicCount) * 100) : 0;
  const stats = {
    totalTopics: topicCount,
    completedTopics: completed,
    overallCompletion,
    phaseBreakdown: [],
  };

  const nextTopics = await prisma.topic.findMany({
    where: {
      phase: { roadmap: { userId } },
      progress: { none: { userId } },
    },
    take: 5,
    include: { phase: true },
    orderBy: [{ phase: { order: "asc" } }, { order: "asc" }],
  });

  return (
    <div className="space-y-5">
      <StatsCards stats={stats} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ProgressChart stats={stats} />
        <ActivityHeatmap />
      </div>
      <Card className="space-y-3">
        <CardTitle>Roadmaps</CardTitle>
        <div className="grid gap-2">
          {roadmaps.map((roadmap) => (
            <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`} className="rounded-md border p-3 hover:bg-black/5 dark:hover:bg-white/5">
              <p className="font-medium">{roadmap.name}</p>
              <p className="text-sm text-[var(--muted)]">{roadmap.description}</p>
            </Link>
          ))}
        </div>
      </Card>
      <Card className="space-y-3">
        <CardTitle>Up Next Recommendations</CardTitle>
        <div className="space-y-2">
          {nextTopics.map((topic) => (
            <div key={topic.id} className="rounded-md border p-3">
              <p className="font-medium">{topic.title}</p>
              <p className="text-sm text-[var(--muted)]">{topic.phase.title}</p>
              <div className="mt-2">
                <Progress value={0} />
              </div>
              <Button asChild className="mt-3" size="sm">
                <Link href={`/topic/${topic.id}`}>Start Topic</Link>
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
