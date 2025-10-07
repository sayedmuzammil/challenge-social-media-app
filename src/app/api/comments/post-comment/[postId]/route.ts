// app/api/comments/post-comment/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params?.postId;
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Expecting { text: string } from client
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const text = body?.text?.toString().trim();
    if (!text) {
      return NextResponse.json(
        { error: 'Field "text" is required' },
        { status: 400 }
      );
    }

    // Forward the same Bearer token the client sent to us
    const auth = request.headers.get('authorization') || '';
    // if (!auth.toLowerCase().startsWith('bearer ')) {
    //   return NextResponse.json(
    //     { error: 'Missing or invalid Authorization header' },
    //     { status: 401 }
    //   );
    // }

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
  } catch (error: any) {
    // Normalize error
    const status = error?.response?.status ?? 500;
    const payload = error?.response?.data ?? {
      error: 'Upstream error',
      message: error?.message || 'Unknown error',
    };

    return NextResponse.json(payload, { status });
  }
}
