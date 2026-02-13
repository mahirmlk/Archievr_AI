import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResourceListClient } from "@/components/resources/resource-list-client";

export default async function ResourcesPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";

  const [resources, roadmaps] = await Promise.all([
    prisma.resource.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.roadmap.findMany({
      where: { userId },
      include: {
        topProjects: true,
        phases: {
          include: {
            topics: {
              include: { projects: true },
            },
          },
        },
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  const projectItems = roadmaps.flatMap((roadmap) => {
    const topicProjects = roadmap.phases.flatMap((phase) =>
      phase.topics.flatMap((topic) =>
        topic.projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          isPortfolio: project.isPortfolio,
          source: "topic" as const,
          roadmapName: roadmap.name,
          topicTitle: topic.title,
          tech: [] as string[],
          impact: null as string | null,
        })),
      ),
    );

    const topProjects = roadmap.topProjects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      isPortfolio: project.isPortfolio,
      source: "top" as const,
      roadmapName: roadmap.name,
      topicTitle: "Top Project",
      tech: project.tech,
      impact: project.impact,
    }));

    return [...topicProjects, ...topProjects];
  });

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-white">Resources</h2>
        <p className="text-sm text-neutral-400">All resources and roadmap projects in one searchable workspace.</p>
      </div>
      <ResourceListClient initialResources={resources} projectItems={projectItems} />
    </div>
  );
}
