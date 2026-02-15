"use client";

import { cn } from "@/lib/utils";

interface TechItem {
    name: string;
    category: string;
}

const techStack: TechItem[] = [
    { name: "Next.js", category: "Framework" },
    { name: "React", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "Prisma", category: "Database" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "OpenAI", category: "AI/ML" },
    { name: "LangChain", category: "AI/ML" },
    { name: "Pinecone", category: "AI/ML" },
    { name: "Vercel", category: "Deployment" },
    { name: "Docker", category: "DevOps" },
    { name: "NextAuth", category: "Auth" },
];

const categories = [
    { name: "Framework", color: "from-blue-400 to-cyan-400" },
    { name: "Language", color: "from-purple-400 to-pink-400" },
    { name: "Database", color: "from-emerald-400 to-teal-400" },
    { name: "Styling", color: "from-orange-400 to-red-400" },
    { name: "AI/ML", color: "from-violet-400 to-purple-400" },
    { name: "Deployment", color: "from-cyan-400 to-blue-400" },
    { name: "Auth", color: "from-pink-400 to-rose-400" },
];

export function TechStack() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-800" />
                <h3 className="text-sm font-medium text-neutral-400">Tech Stack</h3>
                <div className="h-px flex-1 bg-neutral-800" />
            </div>

            <div className="space-y-6">
                {categories.map((category) => {
                    const items = techStack.filter((tech) => tech.category === category.name);

                    if (items.length === 0) return null;

                    return (
                        <div key={category.name} className="space-y-3">
                            <h4 className={cn(
                                "text-xs font-semibold uppercase tracking-wider",
                                "bg-clip-text text-transparent bg-gradient-to-r",
                                category.color
                            )}>
                                {category.name}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {items.map((tech) => (
                                    <span
                                        key={tech.name}
                                        className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-neutral-700 hover:bg-neutral-900"
                                    >
                                        {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
