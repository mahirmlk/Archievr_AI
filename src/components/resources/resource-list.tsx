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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    type: "link",
    url: "",
    content: "",
    tags: "",
  });

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
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                {editingId === resource.id ? (
                  <div className="space-y-2">
                    <Input
                      value={draft.title}
                      onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Title"
                    />
                    <select
                      className="h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                      value={draft.type}
                      onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}
                    >
                      {["link", "note", "file", "video", "book", "course"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={draft.url}
                      onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value }))}
                      placeholder="URL"
                    />
                    <Input
                      value={draft.content}
                      onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Notes"
                    />
                    <Input
                      value={draft.tags}
                      onChange={(e) => setDraft((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="tag1, tag2"
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-sm text-[var(--muted)]">{resource.url ?? resource.content ?? "No content"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge>{resource.type}</Badge>
                      {resource.tags.map((tag) => (
                        <Badge key={tag}>#{tag}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                {editingId === resource.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={async () => {
                        await fetch(`/api/resources/${resource.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: draft.title,
                            type: draft.type,
                            url: draft.url || null,
                            content: draft.content || null,
                            tags: draft.tags
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          }),
                        });
                        setEditingId(null);
                        await onRefresh();
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(resource.id);
                        setDraft({
                          title: resource.title,
                          type: resource.type,
                          url: resource.url ?? "",
                          content: resource.content ?? "",
                          tags: resource.tags.join(", "),
                        });
                      }}
                    >
                      Edit
                    </Button>
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
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">No resources found for the current filters.</p>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
