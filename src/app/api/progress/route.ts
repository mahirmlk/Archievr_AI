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
      status: body.status,
      completionRate,
      notes: body.notes ?? null,
      startedAt: body.status !== "not_started" ? now : null,
      completedAt: body.status === "completed" || body.status === "mastered" ? now : null,
      lastAccessedAt: now,
    },
    update: {
      status: body.status,
      completionRate,
      notes: body.notes,
      completedAt: body.status === "completed" || body.status === "mastered" ? now : null,
      lastAccessedAt: now,
    },
  });

  return NextResponse.json(result);
}
