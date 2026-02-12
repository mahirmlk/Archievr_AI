"use client";

import { create } from "zustand";
import type { ProgressItem, ProgressStats, ProgressStatus } from "@/types/roadmap";

interface ProgressState {
  progressMap: Map<string, ProgressItem>;
  stats: ProgressStats | null;
  loadProgress: () => Promise<void>;
  updateProgress: (topicId: string, status: ProgressStatus) => Promise<void>;
  calculateStats: () => ProgressStats | null;
  loadStats: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: new Map(),
  stats: null,
  loadProgress: async () => {
    const res = await fetch("/api/progress");
    if (!res.ok) return;
    const rows = (await res.json()) as ProgressItem[];
    const map = new Map<string, ProgressItem>();
    rows.forEach((row) => map.set(row.topicId, row));
    set({ progressMap: map });
  },
  updateProgress: async (topicId, status) => {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, status }),
    });
    if (!res.ok) return;
    const row = (await res.json()) as ProgressItem;
    const map = new Map(get().progressMap);
    map.set(topicId, row);
    set({ progressMap: map });
  },
  calculateStats: () => get().stats,
  loadStats: async () => {
    const res = await fetch("/api/progress/stats");
    if (!res.ok) return;
    const stats = (await res.json()) as ProgressStats;
    set({ stats });
  },
}));
