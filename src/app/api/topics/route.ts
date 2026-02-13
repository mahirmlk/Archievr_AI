import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const body = await req.json();

  const phase = await prisma.phase.findFirst({
    where: { id: body.phaseId, roadmap: { userId } },
  });
  if (!phase) return NextResponse.json({ error: "Phase not found" }, { status: 404 });

  const topic = await prisma.topic.create({
    data: {
      phaseId: body.phaseId,
      order: body.order ?? 1,
      title: body.title ?? "New Topic",
      description: body.description ?? "",
      skills: body.skills ?? [],
    },
  });
  return NextResponse.json(topic, { status: 201 });
}
