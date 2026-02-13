"use client";

import { useState } from "react";
import type { ResourceItem } from "@/types/roadmap";
import { ResourceList, type ProjectResourceItem } from "@/components/resources/resource-list";

export function ResourceListClient({
  initialResources,
  projectItems,
}: {
  initialResources: ResourceItem[];
  projectItems: ProjectResourceItem[];
}) {
  const [resources, setResources] = useState(initialResources);

  const refresh = async () => {
    const res = await fetch("/api/resources");
    if (!res.ok) return;
    const rows = (await res.json()) as ResourceItem[];
    setResources(rows);
  };

  return <ResourceList resources={resources} projectItems={projectItems} onRefresh={refresh} />;
}
