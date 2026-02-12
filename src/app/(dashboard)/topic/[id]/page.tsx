import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopicDetail } from "@/components/topic/topic-detail";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  const { id } = await params;

  const topic = await prisma.topic.findFirst({
    where: { id, phase: { roadmap: { userId } } },
    include: {
      projects: true,
      resources: true,
      progress: { where: { userId } },
    },
  });
  if (!topic) notFound();

  return <TopicDetail topic={topic} />;
}
