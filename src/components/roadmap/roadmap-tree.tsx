"use client";

import { useEffect } from "react";
import { useRoadmapStore } from "@/stores/roadmapStore";
import type { Roadmap } from "@/types/roadmap";
import { PhaseNode } from "@/components/roadmap/phase-node";

export function RoadmapTree({ roadmap }: { roadmap: Roadmap }) {
  const setRoadmap = useRoadmapStore((state) => state.loadRoadmap);

  useEffect(() => {
    void setRoadmap(roadmap.id);
  }, [roadmap.id, setRoadmap]);

  return (
    <section className="space-y-4 py-2">
      {roadmap.phases.map((phase) => (
        <PhaseNode key={phase.id} phase={phase} />
      ))}
    </section>
  );
}
