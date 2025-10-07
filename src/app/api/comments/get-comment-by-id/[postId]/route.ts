import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../../../endpoints';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postIdParam = params.postId;

    if (!postIdParam) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '1';
    const limit = url.searchParams.get('limit') ?? '20';

    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.getCommentsListById.replace(
      ':postId',
      postIdParam
    )}?page=${page}&limit=${limit}`;

    console.log('apiUrl : ', apiUrl);

    // const auth = request.headers.get('authorization') || '';

    // axios version
    // const { data } = await axios.get(apiUrl);
    // return NextResponse.json(data);

    // fetch version
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
      // cache: 'no-store',
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text; // keep raw text if not JSON
    }

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      if (data && typeof data === 'object') {
        const maybeErr = data as { error?: unknown; message?: unknown };
        if (typeof maybeErr.error === 'string') message = maybeErr.error;
        else if (typeof maybeErr.message === 'string')
          message = maybeErr.message;
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Failed to get comments:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
