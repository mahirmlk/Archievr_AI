import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { progressToRate } from "@/lib/utils";

export async function GET() {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  const progress = await prisma.progress.findMany({
    where: { userId },
    include: { topic: true },
  });

  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const body = await req.json();
  const now = new Date();
  const completionRate = body.completionRate ?? progressToRate(body.status);
  const topic = await prisma.topic.findFirst({
    where: {
      id: body.topicId,
      phase: { roadmap: { userId } },
    },
    select: { phase: { select: { roadmapId: true } } },
  });

  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  const roadmapId = topic.phase.roadmapId;
  let userRoadmap = await prisma.userRoadmap.findFirst({
    where: { userId, roadmapId },
    select: { id: true },
  });

  if (!userRoadmap) {
    userRoadmap = await prisma.userRoadmap.create({
      data: { userId, roadmapId, isDefault: false, isEditable: true },
      select: { id: true },
    });
  }

  const result = await prisma.progress.upsert({
    where: {
      userId_topicId: {
        userId,
        topicId: body.topicId,
      },
    },
    create: {
      userId,
      topicId: body.topicId,
      userRoadmapId: userRoadmap.id,
      status: body.status,
      completionRate,
      notes: body.notes ?? null,
      startedAt: body.status !== "not_started" ? now : null,
      completedAt: body.status === "completed" || body.status === "mastered" ? now : null,
      lastAccessedAt: now,
    },
    update: {
      status: body.status,
      userRoadmapId: userRoadmap.id,
      completionRate,
      notes: body.notes,
      completedAt: body.status === "completed" || body.status === "mastered" ? now : null,
      lastAccessedAt: now,
    },
  });

  return NextResponse.json(result);
}
