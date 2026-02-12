"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Compass, Home, Settings, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const roadmapActive = pathname.startsWith("/roadmap");

  return (
    <aside className="w-full rounded-2xl border bg-card/80 backdrop-blur-xl md:sticky md:top-6 md:h-[calc(100dvh-3rem)] md:w-72">
      <div className="flex items-center gap-2 border-b p-4">
        <div className="rounded-lg border bg-background p-2">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Archievr AI</p>
          <p className="text-xs text-muted-foreground">ML Engineer Roadmap</p>
        </div>
      </div>
      <nav className="grid gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <div className="my-2 border-t" />
        <Link
          href="/roadmap"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
            roadmapActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Wrench className="h-4 w-4" />
          Roadmap
        </Link>
      </nav>
    </aside>
  );
}
