"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SkillTags } from "@/components/topic/skill-tags";
import { ProjectCard } from "@/components/topic/project-card";
import { ProgressToggle } from "@/components/topic/progress-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProgressStatus, TopicItem } from "@/types/roadmap";

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
      <Card className="space-y-4 p-5">
        <div>
          <CardTitle>{topic.title}</CardTitle>
          <p className="mt-1 text-sm text-neutral-400">{topic.description}</p>
        </div>
        <ProgressToggle initial={(topic.progress[0]?.status as ProgressStatus) ?? "not_started"} onUpdate={updateStatus} />
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-100">Skills</p>
          <SkillTags skills={topic.skills} />
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <CardTitle>Notes</CardTitle>
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        <Button onClick={() => updateStatus((topic.progress[0]?.status as ProgressStatus) ?? "in_progress")}>Save Notes</Button>
      </Card>

      <Card className="space-y-3 p-5">
        <CardTitle>Resources</CardTitle>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="Resource title" value={resourceTitle} onChange={(event) => setResourceTitle(event.target.value)} />
          <Input placeholder="https://..." value={resourceUrl} onChange={(event) => setResourceUrl(event.target.value)} />
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
            <div key={resource.id} className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
              <p className="font-medium text-zinc-100">{resource.title}</p>
              <p className="text-sm text-neutral-400">{resource.url ?? resource.content}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Projects</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/resources">Open in Resources Section</Link>
          </Button>
        </div>
        <section className="grid gap-3 md:grid-cols-2">
          {topic.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </Card>
    </div>
  );
}
