"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoadmapStore } from "@/stores/roadmapStore";
import type { PhaseItem } from "@/types/roadmap";
import { TopicNode } from "@/components/roadmap/topic-node";
import { Button } from "@/components/ui/button";

export function PhaseNode({ phase }: { phase: PhaseItem }) {
  const router = useRouter();
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
          <p className="text-sm text-muted-foreground">{phase.duration}</p>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && (
        <div className="space-y-3 border-t p-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await fetch("/api/topics", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    phaseId: phase.id,
                    order: phase.topics.length + 1,
                    title: "New Topic",
                    description: "",
                    skills: [],
                  }),
                });
                router.refresh();
              }}
            >
              Add Topic
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {phase.topics.map((topic) => (
              <TopicNode key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
