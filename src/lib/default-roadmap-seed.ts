import { prisma } from "@/lib/prisma";
import { defaultRoadmap } from "@/lib/data/default-roadmap";
import { aiEngineerRoadmap } from "@/lib/data/ai-engineer-roadmap";
import { mlEngineerRoadmap } from "@/lib/data/ml-engineer-roadmap";

type DefaultTopicResource = {
  title: string;
  type?: string;
  url?: string;
  content?: string;
  tags?: string[];
};

function topicResources(topic: unknown): DefaultTopicResource[] {
  const resources = (topic as { resources?: DefaultTopicResource[] }).resources;
  return Array.isArray(resources) ? resources : [];
}

type RoadmapData = {
  name: string;
  description: string;
  phases: readonly {
    order: number;
    title: string;
    description: string;
    duration?: string;
    topics: readonly {
      order: number;
      title: string;
      description: string;
      skills: readonly string[];
      resources: readonly unknown[];
      projects: readonly {
        title: string;
        description: string;
        difficulty: string;
        isPortfolio?: boolean;
      }[];
    }[];
  }[];
  topProjects: readonly {
    title: string;
    description: string;
    tech: readonly string[];
    impact: string;
    difficulty: string;
    isPortfolio: boolean;
  }[];
};

export function roadmapCreateData(userId: string, roadmap: RoadmapData, isDefault: boolean) {
  return {
    userId,
    name: roadmap.name,
    description: roadmap.description,
    isDefault,
    isEditable: true,
    phases: {
      create: roadmap.phases.map((phase) => ({
        order: phase.order,
        title: phase.title,
        description: phase.description,
        duration: phase.duration ?? null,
        topics: {
          create: phase.topics.map((topic) => ({
            order: topic.order,
            title: topic.title,
            description: topic.description,
            skills: [...topic.skills],
            resources: {
              create: topicResources(topic).map((resource) => ({
                userId,
                title: resource.title,
                type: resource.type ?? "reference",
                url: resource.url ?? null,
                content: resource.content ?? null,
                tags: resource.tags ?? [],
              })),
            },
            projects: {
              create: topic.projects.map((project) => ({
                title: project.title,
                description: project.description,
                difficulty: project.difficulty,
                isPortfolio: "isPortfolio" in project ? Boolean(project.isPortfolio) : false,
              })),
            },
          })),
        },
      })),
    },
    topProjects: {
      create: roadmap.topProjects.map((project) => ({
        title: project.title,
        description: project.description,
        tech: [...project.tech],
        impact: project.impact,
        difficulty: project.difficulty,
        isPortfolio: project.isPortfolio,
      })),
    },
  };
}

// Keep backward compat
export function defaultRoadmapCreateData(userId: string) {
  return roadmapCreateData(userId, defaultRoadmap as unknown as RoadmapData, true);
}

const ALL_ROADMAPS = [
  { data: defaultRoadmap, isDefault: true },
  { data: aiEngineerRoadmap, isDefault: false },
  { data: mlEngineerRoadmap, isDefault: false },
] as const;

export async function ensureDefaultRoadmap(userId: string) {
  if (!userId) return null;

  // First, clean up any duplicate roadmaps (same name for same user)
  const allUserRoadmaps = await prisma.roadmap.findMany({
    where: { userId },
    select: { id: true, name: true, isDefault: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by name and delete duplicates (keep the oldest)
  const seen = new Map<string, string>();
  const duplicateIds: string[] = [];
  for (const rm of allUserRoadmaps) {
    if (seen.has(rm.name)) {
      duplicateIds.push(rm.id);
    } else {
      seen.set(rm.name, rm.id);
    }
  }

  if (duplicateIds.length > 0) {
    await prisma.roadmap.deleteMany({
      where: { id: { in: duplicateIds } },
    });
  }

  // Now get the clean list
  const existingRoadmaps = await prisma.roadmap.findMany({
    where: { userId },
    select: { id: true, name: true, isDefault: true },
  });

  const existingNames = new Set(existingRoadmaps.map((r) => r.name));

  // Create any missing roadmaps
  for (const { data, isDefault } of ALL_ROADMAPS) {
    const roadmapData = data as unknown as RoadmapData;
    if (existingNames.has(roadmapData.name)) continue;

    await prisma.$transaction(async (tx) => {
      const roadmap = await tx.roadmap.create({
        data: roadmapCreateData(userId, roadmapData, isDefault),
        select: { id: true },
      });

      // Check if UserRoadmap exists before creating
      const existingUr = await tx.userRoadmap.findFirst({
        where: { userId, roadmapId: roadmap.id },
      });
      if (!existingUr) {
        await tx.userRoadmap.create({
          data: {
            userId,
            roadmapId: roadmap.id,
            isDefault,
            isEditable: true,
          },
        });
      }
    });
  }

  // Return the default roadmap id
  const defaultRm = existingRoadmaps.find((r) => r.isDefault) ??
    (await prisma.roadmap.findFirst({ where: { userId, isDefault: true } }));

  return defaultRm?.id ?? null;
}
