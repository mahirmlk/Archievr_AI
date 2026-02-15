// Export all available roadmaps
export { defaultRoadmap } from "./default-roadmap";
export { aiEngineerRoadmap } from "./ai-engineer-roadmap";
export { mlEngineerRoadmap } from "./ml-engineer-roadmap";

// Roadmap metadata for UI selection
export const roadmaps = [
    {
        id: "ai-ml-combined",
        name: "AI/ML Engineer (Combined)",
        description: "Comprehensive roadmap covering both AI engineering and ML engineering",
        roadmap: "defaultRoadmap",
    },
    {
        id: "ai-engineer",
        name: "AI Engineer",
        description: "Specialized in LLMs, agents, RAG, and AI application development",
        roadmap: "aiEngineerRoadmap",
    },
    {
        id: "ml-engineer",
        name: "Machine Learning Engineer",
        description: "Focused on classical ML, deep learning, MLOps, and production systems",
        roadmap: "mlEngineerRoadmap",
    },
] as const;

export type RoadmapId = (typeof roadmaps)[number]["id"];
