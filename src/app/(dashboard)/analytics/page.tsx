import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function AnalyticsPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";

  const [topics, progress] = await Promise.all([
    prisma.topic.findMany({ where: { phase: { roadmap: { userId } } }, include: { phase: true } }),
    prisma.progress.findMany({ where: { userId }, include: { topic: { include: { phase: true } } } }),
  ]);

  const phaseTotals = new Map<string, { title: string; total: number; completed: number }>();
  for (const topic of topics) {
    const entry = phaseTotals.get(topic.phase.id) ?? { title: topic.phase.title, total: 0, completed: 0 };
    entry.total += 1;
    phaseTotals.set(topic.phase.id, entry);
  }
  for (const row of progress) {
    if (row.status !== "completed" && row.status !== "mastered") continue;
    const entry = phaseTotals.get(row.topic.phase.id);
    if (entry) entry.completed += 1;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Progress Analytics</h2>
      {Array.from(phaseTotals.values()).map((phase) => {
        const percent = phase.total ? Math.round((phase.completed / phase.total) * 100) : 0;
        return (
          <Card key={phase.title}>
            <div className="mb-2 flex items-center justify-between">
              <CardTitle>{phase.title}</CardTitle>
              <p className="text-sm text-[var(--muted)]">
                {phase.completed}/{phase.total}
              </p>
            </div>
            <Progress value={percent} />
            <p className="mt-2 text-sm">{percent}% complete</p>
          </Card>
        );
      })}
    </div>
  );
}
