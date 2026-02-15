import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { MagicDock } from "@/components/landing/magic-dock";
import { HeroSection } from "@/components/landing/hero-section";
import {
  ArrowRight,
  Brain,
  Layers,
  LineChart,
  Map as MapIcon,
  Shield,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Adaptive Roadmaps",
    description:
      "Break your AI journey into focused phases. Choose from AI Engineer, ML Engineer, or combined paths.",
  },
  {
    icon: LineChart,
    title: "Progress Intelligence",
    description:
      "Real-time tracking with visual analytics. See completion rates, phase breakdowns, and time estimates.",
  },
  {
    icon: Layers,
    title: "Resource Library",
    description:
      "Attach notes, links, and files to each topic. Your study material stays organized and contextual.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations based on your progress, learning pace, and industry trends.",
  },
  {
    icon: Workflow,
    title: "Multiple Pathways",
    description:
      "Choose between specialized tracks: AI Engineer, ML Engineer, or the comprehensive combined roadmap.",
  },
  {
    icon: Shield,
    title: "Portfolio Projects",
    description:
      "Build production-ready projects at each phase. Create a portfolio that demonstrates real-world skills.",
  },
] as const;

const roadmapPaths = [
  {
    title: "AI Engineer",
    description: "LLMs, RAG, agents, multimodal AI, production systems",
    topics: "24 topics · 6 phases",
  },
  {
    title: "ML Engineer",
    description: "Classical ML, deep learning, MLOps, production pipelines",
    topics: "24 topics · 6 phases",
  },
  {
    title: "AI/ML Combined",
    description: "Comprehensive coverage of both AI and ML engineering",
    topics: "20 topics · 5 phases",
  },
] as const;

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-16 pb-28 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroSection isAuthenticated={!!session?.user?.id} />

        {/* Roadmap Paths */}
        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <Badge className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400">
              <Sparkles className="size-3.5 text-neutral-500" />
              Choose Your Path
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three specialized roadmaps
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-neutral-500">
              Each roadmap is curated with industry-relevant skills, hands-on projects, and portfolio builders.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {roadmapPaths.map((path) => (
              <div
                key={path.title}
                className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-200 hover:border-neutral-700"
              >
                <div className="space-y-4">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-500 w-fit">
                    <MapIcon className="size-4" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {path.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {path.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {path.topics}
                    </span>
                    <ArrowRight className="size-4 text-neutral-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to master AI/ML
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-neutral-500">
              A complete platform designed for focused, production-level learning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all duration-200 hover:border-neutral-700"
              >
                <div className="space-y-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-500 transition-colors group-hover:text-neutral-300">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-100">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Banner */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              { label: "Roadmap Tracks", value: "3" },
              { label: "Total Topics", value: "68+" },
              { label: "Portfolio Projects", value: "30+" },
              { label: "Skills Covered", value: "100+" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MagicDock />
    </>
  );
}
