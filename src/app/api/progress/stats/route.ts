import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function GET() {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  const [topics, progress] = await Promise.all([
    prisma.topic.findMany({
      where: { phase: { roadmap: { userId } } },
      include: { phase: true },
    }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
  ]);

  const totalTopics = topics.length;
  const completed = progress.filter((p) => p.status === "completed" || p.status === "mastered").length;
  const inProgress = progress.filter((p) => p.status === "in_progress").length;
  const notStarted = Math.max(totalTopics - completed - inProgress, 0);
  const overallCompletion = totalTopics ? Math.round((completed / totalTopics) * 100) : 0;

  const byPhase = new Map<
    string,
    { phaseId: string; title: string; total: number; completed: number; percent: number }
  >();

  for (const topic of topics) {
    const phaseId = topic.phase.id;
    const entry = byPhase.get(phaseId) ?? {
      phaseId,
      title: topic.phase.title,
      total: 0,
      completed: 0,
      percent: 0,
    };
    entry.total += 1;
    byPhase.set(phaseId, entry);
  }

  for (const row of progress) {
    if (row.status !== "completed" && row.status !== "mastered") continue;
    const entry = byPhase.get(row.topic.phase.id);
    if (entry) entry.completed += 1;
  }

  const phaseBreakdown = Array.from(byPhase.values()).map((p) => ({
    ...p,
    percent: p.total ? Math.round((p.completed / p.total) * 100) : 0,
  }));

  return NextResponse.json({
    totalTopics,
    completedTopics: completed,
    inProgressTopics: inProgress,
    notStartedTopics: notStarted,
    overallCompletion,
    phaseBreakdown,
  });
}
