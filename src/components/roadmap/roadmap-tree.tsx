"use client";

import { hierarchy, tree, type HierarchyPointLink, type HierarchyPointNode } from "d3";
import { useEffect, useMemo } from "react";
import { useRoadmapStore } from "@/stores/roadmapStore";
import type { Roadmap } from "@/types/roadmap";
import { PhaseNode } from "@/components/roadmap/phase-node";
import { Card, CardTitle } from "@/components/ui/card";

type TreeNode = {
  name: string;
  children?: TreeNode[];
};

export function RoadmapTree({ roadmap }: { roadmap: Roadmap }) {
  const setRoadmap = useRoadmapStore((s) => s.loadRoadmap);

  useEffect(() => {
    void setRoadmap(roadmap.id);
  }, [roadmap.id, setRoadmap]);

  const miniTree = useMemo(() => {
    const root: TreeNode = {
      name: roadmap.name,
      children: roadmap.phases.map((p) => ({
        name: p.title,
        children: p.topics.map((t) => ({ name: t.title })),
      })),
    };
    return tree<TreeNode>().size([240, 560])(hierarchy<TreeNode>(root));
  }, [roadmap]);

  return (
    <div className="space-y-5">
      <Card className="overflow-x-auto">
        <CardTitle className="mb-3">Roadmap Tree Map (D3)</CardTitle>
        <svg viewBox="0 0 620 260" className="h-64 w-full min-w-[620px]">
          {miniTree.links().map((link: HierarchyPointLink<{ name: string }>, idx: number) => (
            <line
              key={idx}
              x1={link.source.y + 20}
              y1={link.source.x + 10}
              x2={link.target.y + 20}
              y2={link.target.x + 10}
              stroke="#94a3b8"
              strokeWidth={1}
            />
          ))}
          {miniTree.descendants().map((node: HierarchyPointNode<{ name: string }>, idx: number) => (
            <g key={idx}>
              <circle cx={node.y + 20} cy={node.x + 10} r={4} fill="var(--primary)" />
            </g>
          ))}
        </svg>
      </Card>
      {roadmap.phases.map((phase) => (
        <PhaseNode key={phase.id} phase={phase} />
      ))}
    </div>
  );
}
