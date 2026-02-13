import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultRoadmap } from "../src/lib/data/default-roadmap";

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

const prisma = new PrismaClient();

// Hash the default password for the demo user
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

async function main() {
  const demoEmail = "achivr@member.com";
  const demoPassword = await hashPassword("achiev2026"); // Updated demo password

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: { 
      email: demoEmail, 
      name: "Demo User",
      password: demoPassword 
    },
  });

  const existing = await prisma.roadmap.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });

  if (existing) {
    await prisma.userRoadmap.upsert({
      where: {
        userId_roadmapId: {
          userId: user.id,
          roadmapId: existing.id,
        },
      },
      update: { isDefault: true, isEditable: true, isActive: true },
      create: {
        userId: user.id,
        roadmapId: existing.id,
        isDefault: true,
        isEditable: true,
        isActive: true,
      },
    });
    return;
  }

  const roadmap = await prisma.roadmap.create({
    data: {
      userId: user.id,
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
                  userId: user.id,
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
    },
  });

  await prisma.userRoadmap.create({
    data: {
      userId: user.id,
      roadmapId: roadmap.id,
      isDefault: true,
      isEditable: true,
      isActive: true,
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
