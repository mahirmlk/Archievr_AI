import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectItem } from "@/types/roadmap";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-medium">{project.title}</h3>
        <Badge>{project.difficulty}</Badge>
      </div>
      <p className="text-sm text-[var(--muted)]">{project.description}</p>
      {project.isPortfolio && <Badge className="mt-3">Portfolio</Badge>}
    </Card>
  );
}
