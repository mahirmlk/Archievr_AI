"use client";

import { ExternalLink, FolderKanban, Pencil, Rocket, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AddResourceModal } from "@/components/resources/add-resource-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ResourceItem } from "@/types/roadmap";

export type ProjectResourceItem = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  isPortfolio: boolean;
  source: "topic" | "top";
  roadmapName: string;
  topicTitle: string;
  tech: string[];
  impact: string | null;
};

const RESOURCE_TYPES = ["link", "note", "file", "video", "book", "course", "article"] as const;

export function ResourceList({
  resources,
  projectItems,
  onRefresh,
}: {
  resources: ResourceItem[];
  projectItems: ProjectResourceItem[];
  onRefresh: () => Promise<void>;
}) {
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

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesType = type ? resource.type === type : true;
      const text = `${resource.title} ${resource.content ?? ""} ${resource.tags.join(" ")}`.toLowerCase();
      const matchesQuery = query ? text.includes(query.toLowerCase()) : true;
      return matchesType && matchesQuery;
    });
  }, [resources, query, type]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return projectItems.filter((project) => {
      const matchesType = type ? type === "project" : true;
      const text = `${project.title} ${project.description} ${project.tech.join(" ")} ${project.roadmapName}`.toLowerCase();
      const matchesQuery = query ? text.includes(normalizedQuery) : true;
      return matchesType && matchesQuery;
    });
  }, [projectItems, query, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources and projects" className="pl-9" />
        </div>
        <select className="ui-select md:w-48" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All types</option>
          {RESOURCE_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="project">project</option>
        </select>
        <AddResourceModal onCreated={onRefresh} />
      </div>

      <section className="space-y-2">
        <p className="font-mono text-xs text-neutral-500">/Resources</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="h-full p-4">
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {editingId === resource.id ? (
                      <Input
                        value={draft.title}
                        onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="Title"
                      />
                    ) : (
                      <p className="font-medium text-zinc-100">{resource.title}</p>
                    )}
                    <Badge>{resource.type}</Badge>
                  </div>
                  {resource.url ? (
                    <a href={resource.url} target="_blank" rel="noreferrer" className="text-neutral-400 transition-colors hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                {editingId === resource.id ? (
                  <div className="space-y-2">
                    <select
                      className="ui-select"
                      value={draft.type}
                      onChange={(event) => setDraft((prev) => ({ ...prev, type: event.target.value }))}
                    >
                      {[...RESOURCE_TYPES].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={draft.url}
                      onChange={(event) => setDraft((prev) => ({ ...prev, url: event.target.value }))}
                      placeholder="URL"
                    />
                    <Input
                      value={draft.content}
                      onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
                      placeholder="Description"
                    />
                    <Input
                      value={draft.tags}
                      onChange={(event) => setDraft((prev) => ({ ...prev, tags: event.target.value }))}
                      placeholder="tag1, tag2"
                    />
                  </div>
                ) : (
                  <p className="line-clamp-3 text-sm text-neutral-400">{resource.content ?? resource.url ?? "No content"}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
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
                        <Pencil className="h-4 w-4 text-neutral-400" />
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
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="font-mono text-xs text-neutral-500">/Projects</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={`${project.source}-${project.id}`} className="h-full p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-100">{project.title}</p>
                  <p className="text-xs text-neutral-500">{project.roadmapName} • {project.topicTitle}</p>
                </div>
                <Badge className="capitalize">{project.difficulty}</Badge>
              </div>
              <p className="text-sm text-neutral-400">{project.description}</p>
              {project.impact ? <p className="mt-2 text-xs text-neutral-500">Impact: {project.impact}</p> : null}
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tech.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
                {project.isPortfolio ? <Badge>Portfolio</Badge> : null}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {filteredResources.length === 0 && filteredProjects.length === 0 ? (
        <Card className="p-5">
          <p className="inline-flex items-center gap-2 text-sm text-neutral-400">
            <FolderKanban className="h-4 w-4 text-neutral-500" />
            No resources or projects found for the current filters.
          </p>
        </Card>
      ) : null}

      <Card className="p-4">
        <p className="inline-flex items-center gap-2 text-sm text-neutral-400">
          <Rocket className="h-4 w-4 text-neutral-500" />
          Projects shown here are sourced from your roadmap topics and top projects.
        </p>
      </Card>
    </div>
  );
}
