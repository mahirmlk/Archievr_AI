import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { roadmapInclude } from "@/lib/roadmap-query";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;

  const { id } = await params;
  const roadmap = await prisma.roadmap.findFirst({
    where: { id, userId },
    include: roadmapInclude,
  });

  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(roadmap);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;
  const body = await req.json();

  const roadmap = await prisma.roadmap.findFirst({ where: { id, userId } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!roadmap.isEditable) return NextResponse.json({ error: "Default roadmap is read-only. Clone to edit." }, { status: 403 });

  const updated = await prisma.roadmap.update({
    where: { id },
    data: { name: body.name, description: body.description },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;

  const roadmap = await prisma.roadmap.findFirst({ where: { id, userId } });
  if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (roadmap.isDefault) return NextResponse.json({ error: "Cannot delete default roadmap." }, { status: 403 });

  await prisma.roadmap.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
