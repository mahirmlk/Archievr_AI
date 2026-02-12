"use client";

import { useState } from "react";
import type { ResourceItem } from "@/types/roadmap";
import { ResourceList } from "@/components/resources/resource-list";

export function ResourceListClient({ initialResources }: { initialResources: ResourceItem[] }) {
  const [resources, setResources] = useState(initialResources);

  const refresh = async () => {
    const res = await fetch("/api/resources");
    if (!res.ok) return;
    const rows = (await res.json()) as ResourceItem[];
    setResources(rows);
  };

  return <ResourceList resources={resources} onRefresh={refresh} />;
}
