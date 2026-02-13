"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDuplicateRoadmap } from "@/hooks/useRoadmaps";
import { RoadmapTree } from "@/components/roadmap/roadmap-tree";
import { RoadmapEditor } from "@/components/roadmap/roadmap-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Roadmap } from "@/types/roadmap";

export function RoadmapViewClient({
  roadmap,
}: {
  roadmap: Roadmap;
}) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [name, setName] = useState(roadmap.name);
  const [description, setDescription] = useState(roadmap.description ?? "");
  const duplicate = useDuplicateRoadmap();

  const exportPayload = useMemo(() => JSON.stringify(roadmap, null, 2), [roadmap]);
  const editorKey = useMemo(
    () => roadmap.phases.map((phase) => `${phase.id}:${phase.title}`).join("|"),
    [roadmap.phases],
  );

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="grid gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Roadmap name" />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Roadmap description"
            className="min-h-[80px]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={async () => {
              setSavingMeta(true);
              await fetch(`/api/roadmaps/${roadmap.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
              });
              setSavingMeta(false);
              router.refresh();
            }}
            disabled={savingMeta}
          >
            {savingMeta ? "Saving..." : "Save Roadmap Details"}
          </Button>
          {roadmap.isDefault ? (
            <p className="self-center text-xs text-muted-foreground">Default roadmap enabled for editing.</p>
          ) : null}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            await duplicate.mutateAsync(roadmap.id);
            router.refresh();
          }}
        >
          Clone Roadmap
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([exportPayload], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${roadmap.name.replace(/\s+/g, "_").toLowerCase()}.json`;
            link.click();
          }}
        >
          Export JSON
        </Button>
        <label className="inline-flex items-center gap-2">
          <Button variant="outline" onClick={() => setImporting((prev) => !prev)}>
            {importing ? "Cancel Import" : "Import JSON"}
          </Button>
          {importing && (
            <input
              type="file"
              accept="application/json"
              className="text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const data = JSON.parse(await file.text()) as Roadmap;
                await fetch(`/api/roadmaps/${roadmap.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                  }),
                });
                router.refresh();
                setImporting(false);
              }}
            />
          )}
        </label>
      </Card>

      <RoadmapEditor key={editorKey} roadmap={roadmap} onRefresh={async () => router.refresh()} />
      <RoadmapTree roadmap={roadmap} />
    </div>
  );
}
