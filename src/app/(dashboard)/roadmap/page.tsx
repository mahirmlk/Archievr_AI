import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ensureDefaultRoadmap } from "@/lib/default-roadmap-seed";

export default async function RoadmapIndexPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  await ensureDefaultRoadmap(userId);

  const firstRoadmap = await prisma.roadmap.findFirst({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
  if (!firstRoadmap) redirect("/dashboard");
  redirect(`/roadmap/${firstRoadmap.id}`);
}
