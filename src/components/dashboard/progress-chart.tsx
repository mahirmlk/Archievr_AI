"use client";

import { scaleBand, scaleLinear } from "d3";
import { Card, CardTitle } from "@/components/ui/card";
import type { ProgressStats } from "@/types/roadmap";

const margin = { top: 20, right: 20, bottom: 50, left: 40 };

export function ProgressChart({ stats }: { stats: ProgressStats | null }) {
  const data = stats?.phaseBreakdown ?? [];
  const width = 680;
  const height = 280;

  const x = scaleBand<string>()
    .domain(data.map((d) => d.title))
    .range([margin.left, width - margin.right])
    .padding(0.2);
  const y = scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

  return (
    <Card className="p-5">
      <CardTitle className="mb-4">Phase-by-Phase Completion</CardTitle>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full min-w-[680px]">
          {data.map((d) => {
            const xPos = x(d.title) ?? 0;
            const yPos = y(d.percent);
            const h = height - margin.bottom - yPos;
            return (
              <g key={d.phaseId}>
                <rect x={xPos} y={yPos} width={x.bandwidth()} height={h} rx={8} fill="#f4f4f5" opacity={0.9} />
                <text x={xPos + x.bandwidth() / 2} y={yPos - 6} textAnchor="middle" fontSize="10" fill="#a1a1aa">
                  {d.percent}%
                </text>
                <text x={xPos + x.bandwidth() / 2} y={height - 16} textAnchor="middle" fontSize="10" fill="#71717a">
                  {d.title.replace("Phase ", "P")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
