"use client";

import { create } from "zustand";
import type { Roadmap, ResourceItem, TopicItem } from "@/types/roadmap";

interface RoadmapState {
  currentRoadmap: Roadmap | null;
  expandedNodes: Set<string>;
  selectedTopic: TopicItem | null;
  isEditing: boolean;
  loadRoadmap: (id: string) => Promise<void>;
  toggleNode: (nodeId: string) => void;
  selectTopic: (topic: TopicItem | null) => void;
  updateTopic: (topicId: string, data: Partial<TopicItem>) => Promise<void>;
  reorderPhase: (phaseId: string, newOrder: number) => Promise<void>;
  addResource: (topicId: string, resource: Partial<ResourceItem>) => Promise<void>;
  setEditing: (value: boolean) => void;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  currentRoadmap: null,
  expandedNodes: new Set<string>(),
  selectedTopic: null,
  isEditing: false,
  loadRoadmap: async (id) => {
    const res = await fetch(`/api/roadmaps/${id}`);
    if (!res.ok) return;
    const data = (await res.json()) as Roadmap;
    set({ currentRoadmap: data });
  },
  toggleNode: (nodeId) => {
    const next = new Set(get().expandedNodes);
    if (next.has(nodeId)) next.delete(nodeId);
    else next.add(nodeId);
    set({ expandedNodes: next });
  },
  selectTopic: (topic) => set({ selectedTopic: topic }),
  updateTopic: async (topicId, data) => {
    await fetch(`/api/topics/${topicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  reorderPhase: async (phaseId, newOrder) => {
    await fetch(`/api/phases/${phaseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
  },
  addResource: async (topicId, resource) => {
    await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, ...resource }),
    });
  },
  setEditing: (value) => set({ isEditing: value }),
}));
