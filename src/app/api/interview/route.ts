import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'product';
  const number = searchParams.get('number') || '5';

  try {
    const response = await fetch(
      `${API_BASE_URL}/maekandex/academy?category=${encodeURIComponent(category)}&number=${number}`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream service returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.questions)) {
      return NextResponse.json(
        { error: 'Invalid question payload structure received' },
        { status: 502 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedQuestions = data.questions.map((item: any, index: number) => ({
      id: `q-${index + 1}`,
      questionText: item.question,
      options: item.options,
      correctOptionIndex: item.answer,
      category,
      jobRole: category,
      difficulty: 'medium',
      explanation: 'Review the correct option and concept breakdown.',
    }));

    return NextResponse.json({ questions: formattedQuestions }, { status: 200 });
  } catch  {
    return NextResponse.json(
      { error: 'Failed to connect to the question server.' },
      { status: 500 }
    );
  }
}