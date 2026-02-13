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
          .map((tag) => tag.trim())
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
          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <select className="ui-select" value={type} onChange={(event) => setType(event.target.value)}>
            {["link", "note", "file", "video", "book", "course", "article"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Input placeholder="URL" value={url} onChange={(event) => setUrl(event.target.value)} />
          <Textarea placeholder="Notes/content" value={content} onChange={(event) => setContent(event.target.value)} />
          <Input placeholder="Tags (comma separated)" value={tags} onChange={(event) => setTags(event.target.value)} />
          <FileUploader onUploaded={setFileUrl} />
          <div className="flex items-center gap-2">
            <Button className="flex-1" onClick={create}>
              Save
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
