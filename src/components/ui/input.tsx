import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-neutral-500 transition-all duration-300 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700",
        className,
      )}
      {...props}
    />
  );
}
