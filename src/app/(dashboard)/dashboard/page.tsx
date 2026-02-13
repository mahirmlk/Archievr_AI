import Link from "next/link";
import { FolderOpen, Map as MapIcon, Rocket } from "lucide-react";
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

  const [roadmaps, progressRows, topicCount, topics, resources] = await Promise.all([
    prisma.roadmap.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
      include: {
        phases: {
          orderBy: { order: "asc" },
          include: {
            topics: {
              orderBy: { order: "asc" },
              include: { resources: true, projects: true },
            },
          },
        },
        topProjects: true,
      },
    }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
    prisma.topic.count({ where: { phase: { roadmap: { userId } } } }),
    prisma.topic.findMany({
      where: { phase: { roadmap: { userId } } },
      include: { phase: true },
      orderBy: [{ phase: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.resource.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),
  ]);

  const completed = progressRows.filter((progress) => progress.status === "completed" || progress.status === "mastered").length;
  const inProgress = progressRows.filter((progress) => progress.status === "in_progress").length;
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

  const activeRoadmap = roadmaps[0] ?? null;
  const topicSections =
    activeRoadmap?.phases.flatMap((phase) =>
      phase.topics.map((topic) => ({
        phaseTitle: phase.title,
        topic,
      })),
    ) ?? [];

  const roadmapProjectCount =
    (activeRoadmap?.topProjects.length ?? 0) +
    (activeRoadmap?.phases.reduce((total, phase) => total + phase.topics.reduce((sum, topic) => sum + topic.projects.length, 0), 0) ?? 0);

  return (
    <div className="space-y-5">
      <StatsCards stats={stats} />
      <RealtimeProgressPanel initialStats={stats} />

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="inline-flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-neutral-400" />
            Roadmap Overview
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/roadmap">Open Full Roadmap</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {phaseBreakdown.map((phase) => (
            <div key={phase.phaseId} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 transition-all duration-300 hover:border-neutral-700">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-zinc-100">{phase.title}</p>
                <p className="text-xs text-neutral-400">{phase.completed}/{phase.total}</p>
              </div>
              <Progress value={phase.percent} />
              <p className="mt-2 text-xs text-neutral-400">{phase.percent}% complete</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="inline-flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-neutral-400" />
            Topic Resources
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/resources">Manage All Resources</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {topicSections.map(({ phaseTitle, topic }) => (
            <div key={topic.id} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 transition-all duration-300 hover:border-neutral-700">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-100">{topic.title}</p>
                  <p className="text-xs text-neutral-500">{phaseTitle}</p>
                </div>
                <Badge>{topic.resources.length} resources</Badge>
              </div>
              <div className="space-y-2">
                {topic.resources.length ? (
                  topic.resources.slice(0, 3).map((resource) => (
                    <div key={resource.id} className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2">
                      <p className="text-sm text-zinc-100">{resource.title}</p>
                      <p className="text-xs text-neutral-400">{resource.type}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500">No resources linked yet. Add resources in Roadmap edit mode or Resources page.</p>
                )}
              </div>
              <Button asChild variant="ghost" size="sm" className="mt-3">
                <Link href={`/topic/${topic.id}`}>Open Topic</Link>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-2">
        <CardTitle className="inline-flex items-center gap-2">
          <Rocket className="h-4 w-4 text-neutral-400" />
          Resources and Projects Summary
        </CardTitle>
        <p className="text-sm text-neutral-400">
          {resources.length} saved resources and {roadmapProjectCount} roadmap projects are available in your resources area.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/resources">Open Resources and Projects</Link>
        </Button>
      </Card>
    </div>
  );
}
