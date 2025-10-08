import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime (axios)

const apiEndpoints = {
  deleteSavePostById: '/posts/:postId/save',
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const base =
      process.env.NEXT_PUBLIC_BASE_API_URL?.replace(/\/+$/, '') || '';
    const path = apiEndpoints.deleteSavePostById.replace(':postId', postId);
    const apiUrl = `${base}${path}`;

    const auth = request.headers.get('authorization') || '';

    const { data, status } = await axios.delete(apiUrl, {
      headers: {
        accept: '*/*',
        Authorization: auth,
      },
    });

    return NextResponse.json(data, { status });
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Error:', err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
