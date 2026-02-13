"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProgressStatus } from "@/types/roadmap";

const statuses: ProgressStatus[] = ["not_started", "in_progress", "completed", "mastered"];

export function ProgressToggle({
  initial,
  onUpdate,
}: {
  initial: ProgressStatus;
  onUpdate: (status: ProgressStatus) => Promise<void>;
}) {
  const [value, setValue] = useState<ProgressStatus>(initial);

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={value === status ? "default" : "outline"}
          size="sm"
          onClick={async () => {
            setValue(status);
            await onUpdate(status);
          }}
        >
          {status.replace("_", " ")}
        </Button>
      ))}
      <Badge>Current: {value.replace("_", " ")}</Badge>
    </div>
  );
}
