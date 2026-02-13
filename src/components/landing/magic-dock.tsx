"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
] as const;

export function MagicDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <nav className="pointer-events-auto mx-auto flex h-14 w-fit items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/90 p-2 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border text-neutral-400 transition-all duration-300",
                "hover:border-neutral-700 hover:bg-neutral-800 hover:text-white",
                isActive ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-800 bg-neutral-900",
              )}
              aria-label={item.label}
            >
              <Icon className="size-4" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
