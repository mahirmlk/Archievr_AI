import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ensureDefaultRoadmap } from "@/lib/default-roadmap-seed";
import { Map as MapIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function RoadmapIndexPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  await ensureDefaultRoadmap(userId);

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: {
      phases: {
        orderBy: { order: "asc" },
        include: { topics: { select: { id: true } } },
      },
    },
  });

  // If only one roadmap, redirect directly
  if (roadmaps.length === 1) {
    const { redirect } = await import("next/navigation");
    redirect(`/roadmap/${roadmaps[0].id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">Select a Roadmap</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Choose a track to view and manage your learning path.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap) => {
          const topicCount = roadmap.phases.reduce(
            (acc, phase) => acc + phase.topics.length,
            0
          );

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
                    {roadmap.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                        {roadmap.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">
                      {roadmap.phases.length} phases · {topicCount} topics
                    </p>
                    <ArrowRight className="size-4 text-neutral-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
