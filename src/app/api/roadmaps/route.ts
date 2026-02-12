import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { roadmapInclude } from "@/lib/roadmap-query";
import { defaultRoadmap } from "@/lib/default-roadmap";

export async function GET() {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  let roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: roadmapInclude,
    orderBy: { createdAt: "asc" },
  });

  if (roadmaps.length === 0) {
    await prisma.roadmap.create({
      data: {
        userId,
        name: defaultRoadmap.name,
        description: defaultRoadmap.description,
        isDefault: true,
        isEditable: false,
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
      },
    });

    roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      include: roadmapInclude,
      orderBy: { createdAt: "asc" },
    });
  }

  return NextResponse.json(roadmaps);
}

export async function POST(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  const body = await req.json();
  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      name: body.name ?? "Custom Roadmap",
      description: body.description ?? "",
      isDefault: false,
      isEditable: true,
    },
  });

  return NextResponse.json(roadmap, { status: 201 });
}
