import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { roadmapInclude } from "@/lib/roadmap-query";
import { ensureDefaultRoadmap } from "@/lib/default-roadmap-seed";

export async function GET() {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  await ensureDefaultRoadmap(userId);

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: roadmapInclude,
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

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
