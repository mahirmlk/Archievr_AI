import { PrismaClient } from "@prisma/client";
import { defaultRoadmap } from "../src/lib/default-roadmap";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@archievr.ai";

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: { email: demoEmail, name: "Demo User" },
  });

  const existing = await prisma.roadmap.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });

  if (existing) return;

  await prisma.roadmap.create({
    data: {
      userId: user.id,
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
