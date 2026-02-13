import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;
  const topic = await prisma.topic.findFirst({
    where: { id, phase: { roadmap: { userId } } },
    include: {
      projects: true,
      resources: true,
      progress: true,
      phase: true,
    },
  });
  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(topic);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;
  const body = await req.json();

  const topic = await prisma.topic.findFirst({
    where: { id, phase: { roadmap: { userId } } },
  });
  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.topic.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      order: body.order,
      skills: body.skills,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;

  const topic = await prisma.topic.findFirst({
    where: { id, phase: { roadmap: { userId } } },
  });
  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.topic.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
