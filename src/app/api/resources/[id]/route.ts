import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.resource.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      type: body.type ?? existing.type,
      url: body.url !== undefined ? body.url : existing.url,
      content: body.content !== undefined ? body.content : existing.content,
      fileUrl: body.fileUrl !== undefined ? body.fileUrl : existing.fileUrl,
      tags: body.tags ?? existing.tags,
      topicId: body.topicId !== undefined ? body.topicId : existing.topicId,
      isPublic: body.isPublic ?? existing.isPublic,
    },
  });

  return NextResponse.json(resource);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const { id } = await params;

  const existing = await prisma.resource.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
