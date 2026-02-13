"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
      <input
        type="file"
        className="block w-full text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border file:border-neutral-800 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:text-zinc-100"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploading(true);
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/resources/upload", { method: "POST", body: formData });
          setUploading(false);
          if (!response.ok) return;
          const data = (await response.json()) as { url: string };
          onUploaded(data.url);
        }}
      />
      <Button variant="outline" size="sm" disabled={uploading}>
        <Upload className="h-4 w-4 text-neutral-400" />
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
}
