import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;
  const body = await req.json();

  const phase = await prisma.phase.findFirst({
    where: { id, roadmap: { userId } },
  });
  if (!phase) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.phase.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      duration: body.duration,
      order: body.order,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;

  const phase = await prisma.phase.findFirst({
    where: { id, roadmap: { userId } },
  });
  if (!phase) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.phase.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
