"use client";

import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Roadmap } from "@/types/roadmap";

function SortablePhase({
  id,
  title,
  onTitleChange,
}: {
  id: string;
  title: string;
  onTitleChange: (id: string, title: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-2 rounded-md border bg-[var(--card)] p-2"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button type="button" className="cursor-grab text-[var(--muted)]" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
      <Input value={title} onChange={(e) => onTitleChange(id, e.target.value)} />
    </div>
  );
}

export function RoadmapEditor({ roadmap, onRefresh }: { roadmap: Roadmap; onRefresh: () => Promise<void> }) {
  const [local, setLocal] = useState(roadmap.phases.map((p) => ({ id: p.id, title: p.title })));
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = local.findIndex((i) => i.id === active.id);
    const newIndex = local.findIndex((i) => i.id === over.id);
    const next = arrayMove(local, oldIndex, newIndex);
    setLocal(next);
    await Promise.all(
      next.map((phase, index) =>
        fetch(`/api/phases/${phase.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index + 1, title: phase.title }),
        }),
      ),
    );
    await onRefresh();
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Roadmap Editor</h3>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{local.length} phases</p>
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
            Add Phase
          </Button>
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={local.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {local.map((phase) => (
              <div key={phase.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <SortablePhase
                    id={phase.id}
                    title={phase.title}
                    onTitleChange={(id, title) =>
                      setLocal((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)))
                    }
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await fetch(`/api/phases/${phase.id}`, { method: "DELETE" });
                    await onRefresh();
                  }}
                  aria-label="Delete phase"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        onClick={async () => {
          await Promise.all(
            local.map((phase, index) =>
              fetch(`/api/phases/${phase.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: index + 1, title: phase.title }),
              }),
            ),
          );
          await onRefresh();
        }}
      >
        Save Order
      </Button>
    </Card>
  );
}
