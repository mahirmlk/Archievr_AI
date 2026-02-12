"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FileUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      <input
        type="file"
        className="block w-full text-sm"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/resources/upload", { method: "POST", body: formData });
          setUploading(false);
          if (!res.ok) return;
          const data = (await res.json()) as { url: string };
          onUploaded(data.url);
        }}
      />
      {uploading && <p className="text-xs text-[var(--muted)]">Uploading...</p>}
      <Button variant="outline" size="sm" disabled={uploading}>
        Upload
      </Button>
    </div>
  );
}
