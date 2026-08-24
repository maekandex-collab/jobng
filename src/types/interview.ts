export type JobRole =
  | 'frontend'
  | 'backend'
  | 'AI'
  | 'data'
  | 'digital_market'
  | 'sales'
  | 'finance'
  | 'leadership'
  | 'entry'
  | 'product';

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

export interface JobRoleOption {
  id: JobRole;
  label: string;
  categories: string[];
}