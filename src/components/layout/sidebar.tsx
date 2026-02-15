"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Compass,
  LayoutDashboard,
  Map,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/resources", label: "Resources", icon: BookOpen },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 ease-in-out md:sticky md:top-6 md:h-[calc(100dvh-3rem)]",
        collapsed ? "md:w-[68px]" : "md:w-72",
        "w-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 p-4">
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            collapsed && "md:justify-center"
          )}
        >
          <div className="shrink-0 rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-300">
            <Compass className="h-4 w-4" />
          </div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              collapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
            )}
          >
            <p className="whitespace-nowrap text-sm font-semibold text-zinc-100">
              Archievr AI
            </p>
            <p className="whitespace-nowrap font-mono text-xs text-neutral-500">
              /AI-ML-Roadmap
            </p>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300 md:block"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="grid gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-300",
                isActive
                  ? "border-neutral-700 bg-neutral-800 text-white"
                  : "border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-white",
                collapsed && "md:justify-center md:px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  collapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
