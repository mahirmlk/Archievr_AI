"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Clock3 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProgressStats } from "@/types/roadmap";

function timeLabel(lastSyncedAt: number) {
  const seconds = Math.max(Math.round((Date.now() - lastSyncedAt) / 1000), 0);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export function RealtimeProgressPanel({ initialStats }: { initialStats: ProgressStats }) {
  const [stats, setStats] = useState(initialStats);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => Date.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = async () => {
      const res = await fetch("/api/progress/stats", { cache: "no-store" });
      if (!res.ok) return;
      const nextStats = (await res.json()) as ProgressStats;
      setStats(nextStats);
      setLastSyncedAt(Date.now());
    };

    const syncTimer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(syncTimer);
  }, []);

  useEffect(() => {
    const labelTimer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(labelTimer);
  }, []);

  const relativeTime = timeLabel(lastSyncedAt);

  const statusBars = useMemo(
    () => [
      { label: "Completed", value: stats.completedTopics, total: stats.totalTopics },
      { label: "In Progress", value: stats.inProgressTopics, total: stats.totalTopics },
      { label: "Not Started", value: stats.notStartedTopics, total: stats.totalTopics },
    ],
    [stats],
  );

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="inline-flex items-center gap-2">
            <Activity className="h-4 w-4 text-neutral-500" />
            Real-Time Progress
          </CardTitle>
          <p className="text-xs text-neutral-500">Auto-refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1">
            <div className="size-1.5 animate-pulse rounded-full bg-neutral-400" />
            <p className="text-xs text-neutral-500">Live</p>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
            <Clock3 className="h-3.5 w-3.5" />
            {relativeTime}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-zinc-100">Overall completion</p>
          <p className="text-neutral-400">{stats.overallCompletion}%</p>
        </div>
        <Progress value={stats.overallCompletion} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {statusBars.map((item) => {
          const percent = item.total ? Math.round((item.value / item.total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-zinc-100">{item.label}</p>
                <p className="text-neutral-400">
                  {item.value}/{item.total}
                </p>
              </div>
              <Progress value={percent} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
