import { prisma } from "@/lib/prisma";
import { defaultRoadmap } from "@/lib/data/default-roadmap";

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

export function defaultRoadmapCreateData(userId: string) {
  return {
    userId,
    name: defaultRoadmap.name,
    description: defaultRoadmap.description,
    isDefault: true,
    isEditable: true,
    phases: {
      create: defaultRoadmap.phases.map((phase) => ({
        order: phase.order,
        title: phase.title,
        description: phase.description,
        duration: phase.duration,
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
      create: defaultRoadmap.topProjects.map((project) => ({
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

export async function ensureDefaultRoadmap(userId: string) {
  if (!userId) return null;

  const existingMapping = await prisma.userRoadmap.findFirst({
    where: { userId, isDefault: true },
    select: {
      id: true,
      roadmapId: true,
      isEditable: true,
      roadmap: { select: { isEditable: true } },
    },
  });

  if (existingMapping) {
    if (!existingMapping.isEditable) {
      await prisma.userRoadmap.update({
        where: { id: existingMapping.id },
        data: { isEditable: true },
      });
    }
    if (!existingMapping.roadmap.isEditable) {
      await prisma.roadmap.update({
        where: { id: existingMapping.roadmapId },
        data: { isEditable: true },
      });
    }
    return existingMapping.roadmapId;
  }

  const existingDefaultRoadmap = await prisma.roadmap.findFirst({
    where: { userId, isDefault: true },
    select: { id: true, isEditable: true },
  });

  if (existingDefaultRoadmap) {
    await prisma.userRoadmap.create({
      data: {
        userId,
        roadmapId: existingDefaultRoadmap.id,
        isDefault: true,
        isEditable: true,
      },
    });

    if (!existingDefaultRoadmap.isEditable) {
      await prisma.roadmap.update({
        where: { id: existingDefaultRoadmap.id },
        data: { isEditable: true },
      });
    }

    return existingDefaultRoadmap.id;
  }

  const created = await prisma.$transaction(async (tx) => {
    const roadmap = await tx.roadmap.create({
      data: defaultRoadmapCreateData(userId),
      select: { id: true },
    });

    await tx.userRoadmap.create({
      data: {
        userId,
        roadmapId: roadmap.id,
        isDefault: true,
        isEditable: true,
      },
    });

    return roadmap;
  });

  return created.id;
}
