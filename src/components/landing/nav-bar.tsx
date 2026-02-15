"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";

export function NavBar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    return (
        <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
            <div className="flex items-center gap-6 rounded-full border border-neutral-800/50 bg-neutral-900/80 px-6 py-3 backdrop-blur-xl transition-all duration-300 hover:border-neutral-700/50 hover:bg-neutral-900/90">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                        <BrainCircuit className="size-4 text-white" />
                    </div>
                    <span className="font-semibold text-white">Archievr</span>
                </Link>

                {/* Divider */}
                <div className="h-6 w-px bg-neutral-800" />

                {/* Links */}
                <div className="flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-white text-black"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
