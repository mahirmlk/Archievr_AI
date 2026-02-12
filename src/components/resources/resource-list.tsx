"use client";

import { useMemo, useState } from "react";
import { AddResourceModal } from "@/components/resources/add-resource-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ResourceItem } from "@/types/roadmap";

export function ResourceList({ resources, onRefresh }: { resources: ResourceItem[]; onRefresh: () => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesType = type ? resource.type === type : true;
      const text = `${resource.title} ${resource.content ?? ""}`.toLowerCase();
      const matchesQuery = query ? text.includes(query.toLowerCase()) : true;
      return matchesType && matchesQuery;
    });
  }, [resources, query, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources" />
        <select className="h-10 rounded-md border bg-transparent px-3 text-sm md:w-48" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {["link", "note", "file", "video", "book", "course"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <AddResourceModal onCreated={onRefresh} />
      </div>

      <section className="grid gap-3">
        {filtered.map((resource) => (
          <Card key={resource.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{resource.title}</p>
                <p className="text-sm text-[var(--muted)]">{resource.url ?? resource.content ?? "No content"}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge>{resource.type}</Badge>
                  {resource.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await fetch(`/api/resources/${resource.id}`, { method: "DELETE" });
                  await onRefresh();
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
