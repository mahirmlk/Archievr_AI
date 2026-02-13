"use client";

import Link from "next/link";
import { CheckCircle2, CircleDot, CircleDashed, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TopicItem } from "@/types/roadmap";

function statusIcon(status?: string) {
  if (status === "mastered" || status === "completed") return <CheckCircle2 className="h-4 w-4 text-neutral-200" />;
  if (status === "in_progress") return <CircleDot className="h-4 w-4 text-neutral-300" />;
  return <CircleDashed className="h-4 w-4 text-neutral-500" />;
}

export function TopicNode({ topic }: { topic: TopicItem }) {
  const status = topic.progress[0]?.status;

  return (
    <Link
      href={`/topic/${topic.id}`}
      className="block rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-zinc-100">{topic.title}</p>
          <p className="text-sm text-neutral-400">{topic.description}</p>
        </div>
        {statusIcon(status)}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {topic.skills.slice(0, 4).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-2">
        <p className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
          <Link2 className="h-3.5 w-3.5" />
          Resources
        </p>
        <p className="text-xs text-neutral-400">{topic.resources.length} linked resources</p>
      </div>
    </Link>
  );
}
