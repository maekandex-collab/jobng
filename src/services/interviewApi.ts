import { Question, JobRole } from '@/types/interview';

interface ApiQuestionItem {
  question: string;
  options: string[];
  answer: number;
}

interface ApiResponse {
  questions: ApiQuestionItem[];
  file?: string;
}

const VALID_JOB_ROLES: JobRole[] = [
  'entry',
  'data',
  'digital_market',
  'frontend',
  'backend',
  'sales',
  'AI',
  'finance',
  'leadership',
  'product',
];

export async function fetchQuestionsFromApi(
  category: JobRole | string,
  number: number
): Promise<Question[]> {
  try {
    // Route to local Next.js proxy handler
    const url = `/api/interview?category=${encodeURIComponent(category)}&number=${number}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      throw new Error('Invalid response structure: "questions" array was not returned.');
    }

    const assignedJobRole: JobRole = VALID_JOB_ROLES.includes(category as JobRole)
      ? (category as JobRole)
      : 'product';

    return data.questions.map((item, index): Question => ({
      id: `q-${index + 1}`,
      questionText: item.question || '',
      options: item.options || [],
      correctOptionIndex: typeof item.answer === 'number' ? item.answer : 0,
      category: String(category),
      jobRole: assignedJobRole,
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred while fetching questions.');
  }
}