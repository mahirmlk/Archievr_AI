import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roadmapInclude } from "@/lib/roadmap-query";
import { RoadmapViewClient } from "@/components/roadmap/roadmap-view-client";

export default async function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  const { id } = await params;

  const roadmap = await prisma.roadmap.findFirst({
    where: { id, userId },
    include: roadmapInclude,
  });
  if (!roadmap) notFound();

  return <RoadmapViewClient roadmap={roadmap} />;
}
