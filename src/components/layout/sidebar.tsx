"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Map, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/resources", label: "Resources", icon: BookOpen },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm md:sticky md:top-6 md:h-[calc(100dvh-3rem)] md:w-72">
      <div className="flex items-center gap-3 border-b border-neutral-800 p-5">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-300">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">Archievr AI</p>
          <p className="font-mono text-xs text-neutral-500">/ML-Roadmap</p>
        </div>
      </div>
      <nav className="grid gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300",
                isActive
                  ? "border-neutral-700 bg-neutral-800 text-white"
                  : "border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
