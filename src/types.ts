export type FocusType = "Fondasi" | "Praktik" | "Quiz" | "Project" | "Evaluasi" | "Review";

export interface MiniQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
}

export interface MiniProject {
  title: string;
  desc: string;
  completed: boolean;
}

export interface DayPlan {
  day: number;
  title: string;
  focus: FocusType;
  duration: string;
  tasks: string[];
  completedTasks: boolean[]; // tracks checklist status for tasks
  resource: string;
  resourceLink?: string;
  quiz: MiniQuiz | null;
  miniProject: MiniProject | null;
  reflection: string;
  reflectionSubmitted?: boolean;
  completed: boolean;
  evaluation?: boolean;
  evaluationData?: {
    halMudah: string;
    halSulit: string;
    targetMingguDepan: string;
    nilaiFokus: number; // 1-10
    submitted: boolean;
  } | null;
}

export interface Roadmap {
  id: string;
  goal: string;
  goalCategory: string; // e.g. frontend, uiux, saham, matematika, content, speaking, english, kampus, custom
  level: "Pemula" | "Sedang" | "Lanjut";
  duration: number; // 30 | 60 | 90
  dailyTime: string; // '15 menit / hari', '30 menit / hari', '60 menit / hari', '90 menit / hari', 'Custom'
  preferences: string[];
  days: DayPlan[];
  createdAt: string;
  completedCount: number;
  xpEarned: number;
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  targetGoalDefault: string;
  dailyTimeDefault: string;
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  theme: "light" | "dark";
  unlockedBadges: string[]; // Badge IDs
}

export interface ResourceItem {
  id: string;
  title: string;
  type: "Artikel" | "Video" | "Tools" | "Checklist" | "Latihan";
  goalCategory: string;
  level: "Semua" | "Pemula" | "Sedang" | "Lanjut";
  url: string;
  read: boolean;
}
