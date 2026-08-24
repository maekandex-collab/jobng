import { API_BASE_URL } from '@/lib/config';
import { Question, JobRole } from '@/types/interview';

interface ProxyResponse {
  questions: Question[];
}

export async function fetchQuestionsFromApi(
  category: JobRole | string,
  number: number
): Promise<Question[]> {
  try {
    const url = `${API_BASE_URL}/api/maekandex/academy?category=${encodeURIComponent(category)}&number=${number}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data: ProxyResponse = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      throw new Error('Invalid response structure: "questions" array was not returned.');
    }

    return data.questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred while fetching questions.');
  }
}