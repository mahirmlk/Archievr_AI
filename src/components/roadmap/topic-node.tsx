"use client";

import Link from "next/link";
import { CircleCheck, CircleDashed, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TopicItem } from "@/types/roadmap";

function statusIcon(status?: string) {
  if (status === "mastered" || status === "completed") return <CircleCheck className="h-4 w-4 text-green-600" />;
  if (status === "in_progress") return <CircleDot className="h-4 w-4 text-blue-600" />;
  return <CircleDashed className="h-4 w-4 text-gray-400" />;
}

export function TopicNode({ topic }: { topic: TopicItem }) {
  const status = topic.progress[0]?.status;
  return (
    <Link href={`/topic/${topic.id}`} className="block rounded-lg border bg-[var(--card)] p-3 hover:bg-black/5 dark:hover:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{topic.title}</p>
          <p className="text-sm text-[var(--muted)]">{topic.description}</p>
        </div>
        {statusIcon(status)}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {topic.skills.slice(0, 4).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
    </Link>
  );
}
