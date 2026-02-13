import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartLine, FolderKanban, Sparkles, Target } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MagicDock } from "@/components/landing/magic-dock";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Adaptive Roadmaps",
    description: "Break your Artificial Intelligence and Machine Learning journey into focused phases and reorder topics as goals evolve.",
    icon: Target,
  },
  {
    title: "Progress Intelligence",
    description: "Track in-progress, completed, and mastered topics with visual analytics across your plan.",
    icon: ChartLine,
  },
  {
    title: "Resource Library",
    description: "Attach notes, links, and files to each topic so your study material stays organized.",
    icon: FolderKanban,
  },
] as const;

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12 pb-28 sm:py-16 sm:pb-32">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wide">
              <Sparkles className="size-3.5" />
              Magic UI Integrated
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Build your Artificial Intelligence and Machine Learning roadmap with clarity and speed.
              </h1>
              <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
                Plan deeply, track progress in real time, and keep resources connected to each topic in one focused workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={session?.user?.id ? "/dashboard" : "/login"}>
                  {session?.user?.id ? "Open Dashboard" : "Sign In to Continue"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              {!session?.user?.id ? (
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Preview Dashboard Route</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-card p-8">
            <div className="pointer-events-none absolute inset-0 top-0 left-0 right-0 h-1/2 overflow-hidden">
              <FlickeringGrid
                className="h-full w-full"
                squareSize={2}
                gridGap={2}
                style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />
            </div>
            <div className="relative space-y-4">
              <div className="inline-flex size-11 items-center justify-center rounded-full border bg-background">
                <BrainCircuit className="size-5" />
              </div>
              <h2 className="text-xl font-semibold">Archievr AI Platform</h2>
              <p className="text-sm text-muted-foreground">
                Organize your roadmap, track progress, and keep every resource aligned to the exact topic you are learning.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
            <span className="rounded-xl border bg-primary px-3 py-1 text-xs font-medium text-background">
              Core Highlights
            </span>
            <div className="h-px flex-1 bg-linear-to-l from-transparent via-border to-transparent" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="h-full rounded-xl border p-5">
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full border bg-background">
                  <item.icon className="size-4" />
                </div>
                <CardTitle className="mb-2">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <MagicDock />
    </>
  );
}
