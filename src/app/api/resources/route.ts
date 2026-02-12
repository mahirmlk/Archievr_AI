import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function GET(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const url = new URL(req.url);
  const search = url.searchParams.get("q");
  const type = url.searchParams.get("type");
  const tag = url.searchParams.get("tag");
  const topicId = url.searchParams.get("topicId");

  const resources = await prisma.resource.findMany({
    where: {
      userId,
      ...(topicId ? { topicId } : {}),
      ...(type ? { type } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { topic: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const { userId, response } = await requireUser();
  if (!userId) return response;
  const body = await req.json();
  const resource = await prisma.resource.create({
    data: {
      userId,
      topicId: body.topicId ?? null,
      title: body.title,
      type: body.type,
      url: body.url ?? null,
      content: body.content ?? null,
      fileUrl: body.fileUrl ?? null,
      tags: body.tags ?? [],
      isPublic: body.isPublic ?? false,
    },
  });
  return NextResponse.json(resource, { status: 201 });
}
