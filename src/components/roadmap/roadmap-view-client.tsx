"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileJson, Pencil, Save, X } from "lucide-react";
import { useDuplicateRoadmap } from "@/hooks/useRoadmaps";
import { RoadmapTree } from "@/components/roadmap/roadmap-tree";
import { RoadmapEditor } from "@/components/roadmap/roadmap-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Roadmap } from "@/types/roadmap";

export function RoadmapViewClient({ roadmap }: { roadmap: Roadmap }) {
  const router = useRouter();
  const duplicate = useDuplicateRoadmap();
  const [editMode, setEditMode] = useState(false);
  const [importing, setImporting] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [name, setName] = useState(roadmap.name);
  const [description, setDescription] = useState(roadmap.description ?? "");

  const exportPayload = useMemo(() => JSON.stringify(roadmap, null, 2), [roadmap]);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-neutral-500">/Roadmap</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">{roadmap.name}</h2>
            <p className="mt-1 text-sm text-neutral-400">{roadmap.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setEditMode((value) => !value)}>
              {editMode ? <X className="h-4 w-4 text-neutral-400" /> : <Pencil className="h-4 w-4 text-neutral-400" />}
              {editMode ? "Exit Edit Mode" : "Edit Roadmap"}
            </Button>
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
              <Download className="h-4 w-4 text-neutral-400" />
              Export JSON
            </Button>
          </div>
        </div>

        {editMode ? (
          <div className="grid gap-3 border-t border-neutral-800 pt-4">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Roadmap name" />
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Roadmap description"
              className="min-h-[90px]"
            />
            <div className="flex flex-wrap items-center gap-2">
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
                <Save className="h-4 w-4 text-neutral-900" />
                {savingMeta ? "Saving..." : "Save Roadmap Details"}
              </Button>
              <label className="inline-flex items-center gap-2">
                <Button variant="outline" onClick={() => setImporting((value) => !value)}>
                  <FileJson className="h-4 w-4 text-neutral-400" />
                  {importing ? "Cancel Import" : "Import JSON"}
                </Button>
                {importing ? (
                  <input
                    type="file"
                    accept="application/json"
                    className="block w-full text-xs text-neutral-400"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const data = JSON.parse(await file.text()) as Roadmap;
                      await fetch(`/api/roadmaps/${roadmap.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: data.name, description: data.description }),
                      });
                      setImporting(false);
                      router.refresh();
                    }}
                  />
                ) : null}
              </label>
            </div>
          </div>
        ) : null}
      </Card>

      {editMode ? <RoadmapEditor roadmap={roadmap} onRefresh={async () => router.refresh()} /> : null}
      <RoadmapTree roadmap={roadmap} />
    </div>
  );
}
