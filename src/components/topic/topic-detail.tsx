"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SkillTags } from "@/components/topic/skill-tags";
import { ProjectCard } from "@/components/topic/project-card";
import { ProgressToggle } from "@/components/topic/progress-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TopicItem } from "@/types/roadmap";
import type { ProgressStatus } from "@/types/roadmap";

export function TopicDetail({ topic }: { topic: TopicItem }) {
  const router = useRouter();
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [notes, setNotes] = useState(topic.progress[0]?.notes ?? "");

  const updateStatus = async (status: ProgressStatus) => {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: topic.id,
        status,
        notes,
      }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div>
          <CardTitle>{topic.title}</CardTitle>
          <p className="mt-1 text-sm text-[var(--muted)]">{topic.description}</p>
        </div>
        <ProgressToggle initial={(topic.progress[0]?.status as ProgressStatus) ?? "not_started"} onUpdate={updateStatus} />
        <div>
          <p className="mb-2 text-sm font-medium">Skills</p>
          <SkillTags skills={topic.skills} />
        </div>
      </Card>

      <Card className="space-y-4">
        <CardTitle>Notes</CardTitle>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button onClick={() => updateStatus((topic.progress[0]?.status as ProgressStatus) ?? "in_progress")}>Save Notes</Button>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Resources</CardTitle>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="Resource title" value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} />
          <Input placeholder="https://..." value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} />
          <Button
            onClick={async () => {
              if (!resourceTitle) return;
              await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  topicId: topic.id,
                  title: resourceTitle,
                  type: "link",
                  url: resourceUrl,
                  tags: [],
                }),
              });
              setResourceTitle("");
              setResourceUrl("");
              router.refresh();
            }}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {topic.resources.map((resource) => (
            <div key={resource.id} className="rounded-md border p-3">
              <p className="font-medium">{resource.title}</p>
              <p className="text-sm text-[var(--muted)]">{resource.url ?? resource.content}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        {topic.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
}
