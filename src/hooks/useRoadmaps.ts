"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Roadmap } from "@/types/roadmap";

export function useRoadmaps() {
  return useQuery({
    queryKey: ["roadmaps"],
    queryFn: async () => {
      const res = await fetch("/api/roadmaps");
      if (!res.ok) throw new Error("Failed to load roadmaps");
      return (await res.json()) as Roadmap[];
    },
  });
}

export function useDuplicateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/roadmaps/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
  });
}
