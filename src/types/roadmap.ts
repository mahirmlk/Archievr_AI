export type ProgressStatus = "not_started" | "in_progress" | "completed" | "mastered";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  isPortfolio: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  url?: string | null;
  content?: string | null;
  fileUrl?: string | null;
  tags: string[];
  topicId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProgressItem {
  id: string;
  topicId: string;
  status: string;
  completionRate: number;
  notes?: string | null;
}

export interface TopicItem {
  id: string;
  order: number;
  title: string;
  description?: string | null;
  skills: string[];
  projects: ProjectItem[];
  resources: ResourceItem[];
  progress: ProgressItem[];
}

export interface PhaseItem {
  id: string;
  order: number;
  title: string;
  description?: string | null;
  duration?: string | null;
  topics: TopicItem[];
}

export interface TopProjectItem {
  id: string;
  title: string;
  description: string;
  tech: string[];
  impact?: string | null;
  difficulty: string;
  isPortfolio: boolean;
}

export interface Roadmap {
  id: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  isEditable: boolean;
  phases: PhaseItem[];
  topProjects: TopProjectItem[];
}

export interface ProgressStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  overallCompletion: number;
  phaseBreakdown: Array<{
    phaseId: string;
    title: string;
    total: number;
    completed: number;
    percent: number;
  }>;
}
