import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ensureDefaultRoadmap } from "@/lib/default-roadmap-seed";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RealtimeProgressPanel } from "@/components/dashboard/realtime-progress-panel";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  await ensureDefaultRoadmap(userId);

  const [roadmaps, progressRows, topicCount, topics] = await Promise.all([
    prisma.roadmap.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
    prisma.topic.count({ where: { phase: { roadmap: { userId } } } }),
    prisma.topic.findMany({
      where: { phase: { roadmap: { userId } } },
      include: { phase: true },
      orderBy: [{ phase: { order: "asc" } }, { order: "asc" }],
    }),
  ]);

  const completed = progressRows.filter((p) => p.status === "completed" || p.status === "mastered").length;
  const inProgress = progressRows.filter((p) => p.status === "in_progress").length;
  const notStarted = Math.max(topicCount - completed - inProgress, 0);
  const overallCompletion = topicCount ? Math.round((completed / topicCount) * 100) : 0;

  const byPhase = new Map<string, { phaseId: string; title: string; total: number; completed: number; percent: number }>();
  for (const row of progressRows) {
    const phaseId = row.topic.phase.id;
    const current = byPhase.get(phaseId) ?? {
      phaseId,
      title: row.topic.phase.title,
      total: 0,
      completed: 0,
      percent: 0,
    };
    byPhase.set(phaseId, current);
  }

  for (const topic of topics) {
    const phaseId = topic.phase.id;
    const current = byPhase.get(phaseId) ?? {
      phaseId,
      title: topic.phase.title,
      total: 0,
      completed: 0,
      percent: 0,
    };
    current.total += 1;
    byPhase.set(phaseId, current);
  }

  for (const row of progressRows) {
    if (row.status !== "completed" && row.status !== "mastered") continue;
    const current = byPhase.get(row.topic.phase.id);
    if (current) current.completed += 1;
  }

  const phaseBreakdown = Array.from(byPhase.values()).map((phase) => ({
    ...phase,
    percent: phase.total ? Math.round((phase.completed / phase.total) * 100) : 0,
  }));

  const stats = {
    totalTopics: topicCount,
    completedTopics: completed,
    inProgressTopics: inProgress,
    notStartedTopics: notStarted,
    overallCompletion,
    phaseBreakdown,
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
      <RealtimeProgressPanel initialStats={stats} />
      <Card className="space-y-3">
        <CardTitle>Roadmaps</CardTitle>
        <div className="grid gap-2">
          {roadmaps.map((roadmap) => (
            <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`} className="rounded-md border p-3 hover:bg-black/5 dark:hover:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{roadmap.name}</p>
                {roadmap.isDefault ? <Badge>Default</Badge> : null}
              </div>
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
