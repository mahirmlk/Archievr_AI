import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const body = await req.json();

  const roadmap = await prisma.roadmap.findFirst({
    where: { id: body.roadmapId, userId },
  });
  if (!roadmap) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  if (!roadmap.isEditable) return NextResponse.json({ error: "Roadmap is read-only" }, { status: 403 });

  const phase = await prisma.phase.create({
    data: {
      roadmapId: body.roadmapId,
      order: body.order ?? 1,
      title: body.title ?? "New Phase",
      description: body.description ?? "",
      duration: body.duration ?? "",
    },
  });

  return NextResponse.json(phase, { status: 201 });
}
