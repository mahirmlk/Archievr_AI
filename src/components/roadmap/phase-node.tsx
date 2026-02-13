"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRoadmapStore } from "@/stores/roadmapStore";
import type { PhaseItem } from "@/types/roadmap";
import { TopicNode } from "@/components/roadmap/topic-node";

export function PhaseNode({ phase }: { phase: PhaseItem }) {
  const expandedNodes = useRoadmapStore((state) => state.expandedNodes);
  const toggleNode = useRoadmapStore((state) => state.toggleNode);
  const isExpanded = expandedNodes.has(phase.id);

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:border-neutral-700">
      <button
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        onClick={() => toggleNode(phase.id)}
      >
        <div className="min-w-0">
          <p className="text-xs font-mono text-neutral-500">{String(phase.order).padStart(2, "0")}</p>
          <p className="text-xl font-semibold tracking-tight text-white">{phase.title}</p>
          <p className="text-sm text-neutral-400">{phase.duration}</p>
          {phase.description ? <p className="mt-1 text-sm text-neutral-500">{phase.description}</p> : null}
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4 text-neutral-400" /> : <ChevronRight className="h-4 w-4 text-neutral-400" />}
      </button>
      {isExpanded ? (
        <div className="grid gap-3 border-t border-neutral-800 p-4 md:grid-cols-2">
          {phase.topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
