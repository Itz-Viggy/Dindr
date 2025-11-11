import { NextResponse } from 'next/server';
import type { SessionRequest } from '@dindr/contracts';
import { postSessionAction } from '@/lib/services/sessions-client';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionRequest;

    if (!body?.sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const response = await postSessionAction(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Session proxy error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to process session action';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
