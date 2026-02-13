import { prisma } from "@/lib/prisma";
import { defaultRoadmap } from "@/lib/default-roadmap";

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

  const existingDefault = await prisma.roadmap.findFirst({
    where: { userId, isDefault: true },
    select: { id: true, isEditable: true },
  });

  if (existingDefault) {
    if (!existingDefault.isEditable) {
      await prisma.roadmap.update({
        where: { id: existingDefault.id },
        data: { isEditable: true },
      });
    }
    return existingDefault.id;
  }

  const created = await prisma.roadmap.create({
    data: defaultRoadmapCreateData(userId),
    select: { id: true },
  });

  return created.id;
}
