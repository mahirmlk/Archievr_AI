import Link from "next/link";
import {
  FolderOpen,
  Map as MapIcon,
  Rocket,
  ArrowRight,
  Sparkles,
} from "lucide-react";
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

  const [roadmaps, progressRows, topicCount, topics, resources] =
    await Promise.all([
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
      prisma.progress.findMany({
        where: { userId },
        include: { topic: { include: { phase: true } } },
      }),
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

  const completed = progressRows.filter(
    (p) => p.status === "completed" || p.status === "mastered"
  ).length;
  const inProgress = progressRows.filter(
    (p) => p.status === "in_progress"
  ).length;
  const notStarted = Math.max(topicCount - completed - inProgress, 0);
  const overallCompletion = topicCount
    ? Math.round((completed / topicCount) * 100)
    : 0;

  const byPhase = new Map<
    string,
    {
      phaseId: string;
      title: string;
      total: number;
      completed: number;
      percent: number;
    }
  >();

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
    percent: phase.total
      ? Math.round((phase.completed / phase.total) * 100)
      : 0,
  }));

  const stats = {
    totalTopics: topicCount,
    completedTopics: completed,
    inProgressTopics: inProgress,
    notStartedTopics: notStarted,
    overallCompletion,
    phaseBreakdown,
  };

  return (
    <div className="space-y-5">
      <StatsCards stats={stats} />
      <RealtimeProgressPanel initialStats={stats} />

      {/* All Roadmaps */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-neutral-500" />
          <h2 className="font-semibold text-zinc-100">Your Roadmaps</h2>
          <Badge className="text-xs">{roadmaps.length} tracks</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => {
            const rmTopics = roadmap.phases.reduce(
              (acc, phase) => acc + phase.topics.length,
              0
            );
            const rmCompleted = roadmap.phases.reduce(
              (acc, phase) =>
                acc +
                phase.topics.filter((t) =>
                  progressRows.some(
                    (p) =>
                      p.topicId === t.id &&
                      (p.status === "completed" || p.status === "mastered")
                  )
                ).length,
              0
            );
            const rmPercent = rmTopics
              ? Math.round((rmCompleted / rmTopics) * 100)
              : 0;

            return (
              <Link key={roadmap.id} href={`/roadmap/${roadmap.id}`}>
                <Card className="group h-full p-5 transition-all duration-200 hover:border-neutral-700">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 transition-colors group-hover:text-neutral-300">
                        <MapIcon className="size-4" />
                      </div>
                      {roadmap.isDefault && (
                        <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-500">
                          Default
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-zinc-100">
                        {roadmap.name}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {roadmap.phases.length} phases · {rmTopics} topics
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Progress</span>
                        <span className="text-neutral-400">{rmPercent}%</span>
                      </div>
                      <Progress value={rmPercent} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        {rmCompleted}/{rmTopics} completed
                      </p>
                      <ArrowRight className="size-4 text-neutral-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Phase Breakdown */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="inline-flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-neutral-500" />
            Phase Breakdown
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/roadmap">Open Roadmap</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {phaseBreakdown.map((phase) => (
            <div
              key={phase.phaseId}
              className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 transition-all duration-200 hover:border-neutral-700"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-100">
                  {phase.title}
                </p>
                <span className="text-xs text-neutral-500">
                  {phase.completed}/{phase.total}
                </span>
              </div>
              <Progress value={phase.percent} className="h-1.5" />
              <p className="mt-2 text-xs text-neutral-500">
                {phase.percent}% complete
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/roadmap">
          <Card className="group p-5 transition-all duration-200 hover:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 group-hover:text-neutral-300">
                <MapIcon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">View Roadmap</p>
                <p className="text-xs text-neutral-500">Explore & track</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/resources">
          <Card className="group p-5 transition-all duration-200 hover:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 group-hover:text-neutral-300">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">Resources</p>
                <p className="text-xs text-neutral-500">
                  {resources.length} saved
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/roadmap">
          <Card className="group p-5 transition-all duration-200 hover:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 group-hover:text-neutral-300">
                <Rocket className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">Projects</p>
                <p className="text-xs text-neutral-500">Build & deploy</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
