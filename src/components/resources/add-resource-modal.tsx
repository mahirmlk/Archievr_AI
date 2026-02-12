"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/resources/file-uploader";

export function AddResourceModal({ onCreated }: { onCreated: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("link");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [tags, setTags] = useState("");

  const create = async () => {
    await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        url,
        content,
        fileUrl,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    setOpen(false);
    setTitle("");
    setUrl("");
    setContent("");
    setFileUrl("");
    setTags("");
    await onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Resource</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="h-10 w-full rounded-md border bg-transparent px-3 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
            {["link", "note", "file", "video", "book", "course"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Textarea placeholder="Notes/content" value={content} onChange={(e) => setContent(e.target.value)} />
          <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <FileUploader onUploaded={setFileUrl} />
          <Button className="w-full" onClick={create}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
