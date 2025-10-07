import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime (axios)

const apiEndpoints = {
  deleteSavePostById: '/posts/:postId/save',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
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
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const payload = error?.response?.data || {
      message: error?.message || 'Internal Error',
    };
    console.error('Unsave proxy failed:', payload);
    return NextResponse.json({ error: payload }, { status });
  }
}
