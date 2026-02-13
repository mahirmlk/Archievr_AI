"use client";

import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Roadmap } from "@/types/roadmap";

type LocalResource = {
  id: string;
  title: string;
  type: string;
  url: string;
  content: string;
  tags: string;
};

type LocalTopic = {
  id: string;
  title: string;
  description: string;
  skills: string;
  resources: LocalResource[];
};

type LocalPhase = {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: LocalTopic[];
};

function toLocal(roadmap: Roadmap): LocalPhase[] {
  return roadmap.phases.map((phase) => ({
    id: phase.id,
    title: phase.title,
    description: phase.description ?? "",
    duration: phase.duration ?? "",
    topics: phase.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description ?? "",
      skills: topic.skills.join(", "),
      resources: topic.resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url ?? "",
        content: resource.content ?? "",
        tags: resource.tags.join(", "),
      })),
    })),
  }));
}

function SortablePhaseRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <div className="mb-3 flex items-start gap-2">
        <button
          type="button"
          className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 transition-colors hover:text-white"
          {...attributes}
          {...listeners}
          aria-label="Reorder phase"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function RoadmapEditor({ roadmap, onRefresh }: { roadmap: Roadmap; onRefresh: () => Promise<void> }) {
  const [local, setLocal] = useState<LocalPhase[]>(() => toLocal(roadmap));
  const [saving, setSaving] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setLocal(toLocal(roadmap));
  }, [roadmap]);

  const topicCount = useMemo(
    () => local.reduce((count, phase) => count + phase.topics.length, 0),
    [local],
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = local.findIndex((i) => i.id === active.id);
    const newIndex = local.findIndex((i) => i.id === over.id);
    setLocal((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (let phaseIndex = 0; phaseIndex < local.length; phaseIndex += 1) {
        const phase = local[phaseIndex];
        await fetch(`/api/phases/${phase.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: phaseIndex + 1,
            title: phase.title,
            description: phase.description,
            duration: phase.duration,
          }),
        });

        for (let topicIndex = 0; topicIndex < phase.topics.length; topicIndex += 1) {
          const topic = phase.topics[topicIndex];
          await fetch(`/api/topics/${topic.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order: topicIndex + 1,
              title: topic.title,
              description: topic.description,
              skills: topic.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
            }),
          });

          for (const resource of topic.resources) {
            if (resource.id.startsWith("new-")) {
              await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  topicId: topic.id,
                  title: resource.title || "New Resource",
                  type: resource.type || "link",
                  url: resource.url || null,
                  content: resource.content || null,
                  tags: resource.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }),
              });
            } else {
              await fetch(`/api/resources/${resource.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  topicId: topic.id,
                  title: resource.title,
                  type: resource.type,
                  url: resource.url || null,
                  content: resource.content || null,
                  tags: resource.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }),
              });
            }
          }
        }
      }
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <h3 className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
            <Pencil className="h-4 w-4 text-neutral-400" />
            Edit Roadmap
          </h3>
          <p className="text-sm text-neutral-400">{local.length} phases, {topicCount} topics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              await fetch("/api/phases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roadmapId: roadmap.id, order: local.length + 1, title: "New Phase" }),
              });
              await onRefresh();
            }}
          >
            <Plus className="h-4 w-4 text-neutral-400" />
            Add Phase
          </Button>
          <Button variant="ghost" onClick={() => setLocal(toLocal(roadmap))}>Reset</Button>
          <Button onClick={saveAll} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={local.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div>
            {local.map((phase, phaseIndex) => (
              <SortablePhaseRow key={phase.id} id={phase.id}>
                <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      value={phase.title}
                      onChange={(event) => {
                        const value = event.target.value;
                        setLocal((prev) =>
                          prev.map((item, index) => (index === phaseIndex ? { ...item, title: value } : item)),
                        );
                      }}
                      placeholder="Phase title"
                    />
                    <Input
                      value={phase.duration}
                      onChange={(event) => {
                        const value = event.target.value;
                        setLocal((prev) =>
                          prev.map((item, index) => (index === phaseIndex ? { ...item, duration: value } : item)),
                        );
                      }}
                      placeholder="Duration"
                    />
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await fetch(`/api/phases/${phase.id}`, { method: "DELETE" });
                        await onRefresh();
                        setLocal((prev) => prev.filter((row) => row.id !== phase.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Phase
                    </Button>
                  </div>

                  <Textarea
                    value={phase.description}
                    onChange={(event) => {
                      const value = event.target.value;
                      setLocal((prev) =>
                        prev.map((item, index) => (index === phaseIndex ? { ...item, description: value } : item)),
                      );
                    }}
                    placeholder="Phase description"
                    className="min-h-[72px]"
                  />

                  <div className="space-y-2 border-t border-neutral-800 pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-100">Topics</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await fetch("/api/topics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              phaseId: phase.id,
                              order: phase.topics.length + 1,
                              title: "New Topic",
                              description: "",
                              skills: [],
                            }),
                          });
                          await onRefresh();
                        }}
                      >
                        <Plus className="h-4 w-4 text-neutral-400" />
                        Add Topic
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {phase.topics.map((topic, topicIndex) => (
                        <div key={topic.id} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Input
                              value={topic.title}
                              onChange={(event) => {
                                const value = event.target.value;
                                setLocal((prev) =>
                                  prev.map((phaseItem, pIndex) => {
                                    if (pIndex !== phaseIndex) return phaseItem;
                                    return {
                                      ...phaseItem,
                                      topics: phaseItem.topics.map((topicItem, tIndex) =>
                                        tIndex === topicIndex ? { ...topicItem, title: value } : topicItem,
                                      ),
                                    };
                                  }),
                                );
                              }}
                              placeholder="Topic title"
                              className="min-w-[220px] flex-1"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                await fetch(`/api/topics/${topic.id}`, { method: "DELETE" });
                                await onRefresh();
                                setLocal((prev) =>
                                  prev.map((phaseItem, pIndex) => {
                                    if (pIndex !== phaseIndex) return phaseItem;
                                    return {
                                      ...phaseItem,
                                      topics: phaseItem.topics.filter((topicItem) => topicItem.id !== topic.id),
                                    };
                                  }),
                                );
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Topic
                            </Button>
                          </div>

                          <Textarea
                            value={topic.description}
                            onChange={(event) => {
                              const value = event.target.value;
                              setLocal((prev) =>
                                prev.map((phaseItem, pIndex) => {
                                  if (pIndex !== phaseIndex) return phaseItem;
                                  return {
                                    ...phaseItem,
                                    topics: phaseItem.topics.map((topicItem, tIndex) =>
                                      tIndex === topicIndex ? { ...topicItem, description: value } : topicItem,
                                    ),
                                  };
                                }),
                              );
                            }}
                            placeholder="Topic description"
                            className="min-h-[64px]"
                          />

                          <Input
                            className="mt-2"
                            value={topic.skills}
                            onChange={(event) => {
                              const value = event.target.value;
                              setLocal((prev) =>
                                prev.map((phaseItem, pIndex) => {
                                  if (pIndex !== phaseIndex) return phaseItem;
                                  return {
                                    ...phaseItem,
                                    topics: phaseItem.topics.map((topicItem, tIndex) =>
                                      tIndex === topicIndex ? { ...topicItem, skills: value } : topicItem,
                                    ),
                                  };
                                }),
                              );
                            }}
                            placeholder="Skills (comma separated)"
                          />

                          <div className="mt-3 space-y-2 border-t border-neutral-800 pt-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Resources</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const id = `new-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                                  setLocal((prev) =>
                                    prev.map((phaseItem, pIndex) => {
                                      if (pIndex !== phaseIndex) return phaseItem;
                                      return {
                                        ...phaseItem,
                                        topics: phaseItem.topics.map((topicItem, tIndex) =>
                                          tIndex === topicIndex
                                            ? {
                                                ...topicItem,
                                                resources: [
                                                  ...topicItem.resources,
                                                  {
                                                    id,
                                                    title: "",
                                                    type: "link",
                                                    url: "",
                                                    content: "",
                                                    tags: "",
                                                  },
                                                ],
                                              }
                                            : topicItem,
                                        ),
                                      };
                                    }),
                                  );
                                }}
                              >
                                <Plus className="h-4 w-4 text-neutral-400" />
                                Add Resource
                              </Button>
                            </div>

                            {topic.resources.map((resource, resourceIndex) => (
                              <div key={resource.id} className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-3">
                                <div className="grid gap-2 md:grid-cols-3">
                                  <Input
                                    value={resource.title}
                                    onChange={(event) => {
                                      const value = event.target.value;
                                      setLocal((prev) =>
                                        prev.map((phaseItem, pIndex) => {
                                          if (pIndex !== phaseIndex) return phaseItem;
                                          return {
                                            ...phaseItem,
                                            topics: phaseItem.topics.map((topicItem, tIndex) => {
                                              if (tIndex !== topicIndex) return topicItem;
                                              return {
                                                ...topicItem,
                                                resources: topicItem.resources.map((resourceItem, rIndex) =>
                                                  rIndex === resourceIndex ? { ...resourceItem, title: value } : resourceItem,
                                                ),
                                              };
                                            }),
                                          };
                                        }),
                                      );
                                    }}
                                    placeholder="Resource title"
                                  />
                                  <select
                                    value={resource.type}
                                    onChange={(event) => {
                                      const value = event.target.value;
                                      setLocal((prev) =>
                                        prev.map((phaseItem, pIndex) => {
                                          if (pIndex !== phaseIndex) return phaseItem;
                                          return {
                                            ...phaseItem,
                                            topics: phaseItem.topics.map((topicItem, tIndex) => {
                                              if (tIndex !== topicIndex) return topicItem;
                                              return {
                                                ...topicItem,
                                                resources: topicItem.resources.map((resourceItem, rIndex) =>
                                                  rIndex === resourceIndex ? { ...resourceItem, type: value } : resourceItem,
                                                ),
                                              };
                                            }),
                                          };
                                        }),
                                      );
                                    }}
                                    className="ui-select"
                                  >
                                    {[
                                      "link",
                                      "article",
                                      "video",
                                      "course",
                                      "book",
                                      "note",
                                      "project",
                                    ].map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      if (resource.id.startsWith("new-")) {
                                        setLocal((prev) =>
                                          prev.map((phaseItem, pIndex) => {
                                            if (pIndex !== phaseIndex) return phaseItem;
                                            return {
                                              ...phaseItem,
                                              topics: phaseItem.topics.map((topicItem, tIndex) => {
                                                if (tIndex !== topicIndex) return topicItem;
                                                return {
                                                  ...topicItem,
                                                  resources: topicItem.resources.filter((row) => row.id !== resource.id),
                                                };
                                              }),
                                            };
                                          }),
                                        );
                                        return;
                                      }

                                      await fetch(`/api/resources/${resource.id}`, { method: "DELETE" });
                                      await onRefresh();
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                                <Input
                                  className="mt-2"
                                  value={resource.url}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setLocal((prev) =>
                                      prev.map((phaseItem, pIndex) => {
                                        if (pIndex !== phaseIndex) return phaseItem;
                                        return {
                                          ...phaseItem,
                                          topics: phaseItem.topics.map((topicItem, tIndex) => {
                                            if (tIndex !== topicIndex) return topicItem;
                                            return {
                                              ...topicItem,
                                              resources: topicItem.resources.map((resourceItem, rIndex) =>
                                                rIndex === resourceIndex ? { ...resourceItem, url: value } : resourceItem,
                                              ),
                                            };
                                          }),
                                        };
                                      }),
                                    );
                                  }}
                                  placeholder="URL"
                                />
                                <Textarea
                                  className="mt-2 min-h-[58px]"
                                  value={resource.content}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setLocal((prev) =>
                                      prev.map((phaseItem, pIndex) => {
                                        if (pIndex !== phaseIndex) return phaseItem;
                                        return {
                                          ...phaseItem,
                                          topics: phaseItem.topics.map((topicItem, tIndex) => {
                                            if (tIndex !== topicIndex) return topicItem;
                                            return {
                                              ...topicItem,
                                              resources: topicItem.resources.map((resourceItem, rIndex) =>
                                                rIndex === resourceIndex ? { ...resourceItem, content: value } : resourceItem,
                                              ),
                                            };
                                          }),
                                        };
                                      }),
                                    );
                                  }}
                                  placeholder="Notes"
                                />
                                <Input
                                  className="mt-2"
                                  value={resource.tags}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setLocal((prev) =>
                                      prev.map((phaseItem, pIndex) => {
                                        if (pIndex !== phaseIndex) return phaseItem;
                                        return {
                                          ...phaseItem,
                                          topics: phaseItem.topics.map((topicItem, tIndex) => {
                                            if (tIndex !== topicIndex) return topicItem;
                                            return {
                                              ...topicItem,
                                              resources: topicItem.resources.map((resourceItem, rIndex) =>
                                                rIndex === resourceIndex ? { ...resourceItem, tags: value } : resourceItem,
                                              ),
                                            };
                                          }),
                                        };
                                      }),
                                    );
                                  }}
                                  placeholder="Tags (comma separated)"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SortablePhaseRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}
