import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;

  const source = await prisma.roadmap.findFirst({
    where: { id, userId },
    include: {
      phases: {
        include: {
          topics: {
            include: {
              projects: true,
            },
          },
        },
      },
      topProjects: true,
    },
  });

  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const duplicated = await prisma.$transaction(async (tx) => {
    const roadmap = await tx.roadmap.create({
      data: {
        userId,
        name: `${source.name} (Copy)`,
        description: source.description,
        isDefault: false,
        isEditable: true,
        phases: {
          create: source.phases.map((phase) => ({
            order: phase.order,
            title: phase.title,
            description: phase.description,
            duration: phase.duration,
            topics: {
              create: phase.topics.map((topic) => ({
                order: topic.order,
                title: topic.title,
                description: topic.description,
                skills: topic.skills,
                projects: {
                  create: topic.projects.map((project) => ({
                    title: project.title,
                    description: project.description,
                    difficulty: project.difficulty,
                    isPortfolio: project.isPortfolio,
                  })),
                },
              })),
            },
          })),
        },
        topProjects: {
          create: source.topProjects.map((project) => ({
            title: project.title,
            description: project.description,
            tech: project.tech,
            impact: project.impact,
            difficulty: project.difficulty,
            isPortfolio: project.isPortfolio,
          })),
        },
      },
    });

    await tx.userRoadmap.create({
      data: {
        userId,
        roadmapId: roadmap.id,
        isDefault: false,
        isEditable: true,
      },
    });

    return roadmap;
  });

  return NextResponse.json(duplicated, { status: 201 });
}
