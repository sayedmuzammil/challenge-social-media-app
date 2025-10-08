import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    // Await the params
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Expecting { text: string } from client
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    let text: string | null = null;
    if (body && typeof body === 'object' && 'text' in body) {
      const v = (body as Record<string, unknown>).text;
      if (typeof v === 'string') text = v.trim();
    }
    if (!text) {
      return NextResponse.json(
        { error: 'Field "text" is required' },
        { status: 400 }
      );
    }

    // Forward the same Bearer token the client sent to us
    const auth = request.headers.get('authorization') || '';

    const base = process.env.NEXT_PUBLIC_BASE_API_URL?.replace(/\/+$/, '');

    const url = `${base}/posts/${postId}/comments`;

    // axios signature: axios.post(url, data, { headers })
    const { data, status } = await axios.post(
      url,
      { text },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: auth,
        },
      }
    );

    return NextResponse.json(data, { status });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Error:', err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
