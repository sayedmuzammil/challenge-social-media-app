import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    // Construct the API URL with query parameters
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.feed}?page=${page}&limit=${limit}`;

    const auth = request.headers.get('authorization') || '';

    const { data } = await axios.get(apiUrl, {
      headers: {
        accept: '*/*',
        Authorization: auth, // already "Bearer <token>"
      },
    });

    return NextResponse.json(data);
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Error:', err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
