import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function RoadmapIndexPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  const firstRoadmap = await prisma.roadmap.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  if (!firstRoadmap) redirect("/dashboard");
  redirect(`/roadmap/${firstRoadmap.id}`);
}
