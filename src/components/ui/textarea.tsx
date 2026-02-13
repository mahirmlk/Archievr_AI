import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-neutral-500 transition-all duration-300 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700",
        className,
      )}
      {...props}
    />
  );
}
