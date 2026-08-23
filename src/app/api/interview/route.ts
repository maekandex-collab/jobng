import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

interface UpstreamQuestionItem {
  question: string;
  options: string[];
  answer: number;
}

interface UpstreamResponse {
  questions: UpstreamQuestionItem[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'product';
  const number = searchParams.get('number') || '5';

  try {
    const upstreamUrl = `${API_BASE_URL}/api/maekandex/academy?category=${encodeURIComponent(category)}&number=${encodeURIComponent(number)}`;
    
    const response = await fetch(upstreamUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream service returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data: UpstreamResponse = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      return NextResponse.json(
        { error: 'Invalid question payload structure received' },
        { status: 502 }
      );
    }

    const formattedQuestions = data.questions.map((item, index) => ({
      id: `q-${index + 1}`,
      questionText: item.question || '',
      options: item.options || [],
      correctOptionIndex: typeof item.answer === 'number' ? item.answer : 0,
      category,
      jobRole: category,
    }));

    return NextResponse.json({ questions: formattedQuestions }, { status: 200 });
  } catch (err) {
    console.error('Next.js API Proxy Error:', err);
    return NextResponse.json(
      { error: 'Failed to connect to the question server.' },
      { status: 500 }
    );
  }
}