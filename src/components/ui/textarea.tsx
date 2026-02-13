import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-shadow duration-200 focus:ring-2 focus:ring-[var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}
