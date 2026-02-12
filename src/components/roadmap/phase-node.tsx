"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRoadmapStore } from "@/stores/roadmapStore";
import type { PhaseItem } from "@/types/roadmap";
import { TopicNode } from "@/components/roadmap/topic-node";

export function PhaseNode({ phase }: { phase: PhaseItem }) {
  const expandedNodes = useRoadmapStore((s) => s.expandedNodes);
  const toggleNode = useRoadmapStore((s) => s.toggleNode);
  const isExpanded = expandedNodes.has(phase.id);
  return (
    <section className="rounded-xl border bg-[var(--card)]">
      <button
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={() => toggleNode(phase.id)}
      >
        <div>
          <p className="font-semibold">{phase.title}</p>
          <p className="text-sm text-[var(--muted)]">{phase.duration}</p>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && (
        <div className="grid gap-3 border-t p-4 md:grid-cols-2">
          {phase.topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}
