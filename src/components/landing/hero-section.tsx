"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
    isAuthenticated?: boolean;
}

export function HeroSection({ isAuthenticated = false }: HeroSectionProps) {
    return (
        <section className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            {/* Left Column */}
            <div className="space-y-6">
                <Badge className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <Sparkles className="size-3.5 text-neutral-500" />
                    /Experience
                </Badge>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Build your machine learning roadmap with clarity and production focus.
                    </h1>

                    <p className="max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                        Plan deeply, track progress in real time, and keep resources
                        connected to each topic in one workspace.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" className="group">
                        <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                            {isAuthenticated ? "Open Dashboard" : "Sign In to Continue"}
                            <ArrowRight className="ml-2 size-4 text-neutral-900 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </Button>

                    {!isAuthenticated && (
                        <Button asChild variant="outline" size="lg" className="group">
                            <Link href="/dashboard">
                                Preview Dashboard
                                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                    <div className="inline-flex size-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-500">
                        <Sparkles className="size-6" />
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        Archievr AI Platform
                    </h2>

                    <p className="text-sm leading-relaxed text-neutral-400">
                        Organize your roadmap, track progress, and keep every resource
                        aligned to the exact topic you are learning. Built for AI engineers
                        and ML practitioners.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {["Adaptive", "Intelligent", "Focused"].map((feature) => (
                            <span
                                key={feature}
                                className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-400"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
