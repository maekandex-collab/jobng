export type JobRole = "frontend" | "cyber_security" | "data" | "product" | "digital_market" | "entry" | "backend" | "sales" | "AI" | "finance" | "leadership";

export interface Question {
  id: string;
  category: string;
  jobRole: JobRole;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface InterviewConfig {
  jobRole: JobRole;
  questionCount: number;
}

export interface UserResponse {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}
