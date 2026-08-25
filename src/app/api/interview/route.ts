import { NextRequest, NextResponse } from 'next/server';
import { fetchQuestionsFromApi } from '@/lib/jobApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const numberStr = searchParams.get('number') || '10';
    const number = parseInt(numberStr, 10);

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required.' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : undefined;

    // Delegate call — passes token if provided, operates publicly if omitted
    const questions = await fetchQuestionsFromApi(category, number, token);

    return NextResponse.json({ questions }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    if (message.includes('expired') || message.includes('unauthorized')) {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}