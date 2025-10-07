// app/api/me/saved/route.ts
import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export const runtime = 'nodejs'; // ensure Node runtime for axios
export const dynamic = 'force-dynamic'; // do not cache this route

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '20';

    // Sanitize base + path to avoid double/missing slashes
    const base = (process.env.NEXT_PUBLIC_BASE_API_URL || '').replace(
      /\/+$/,
      ''
    );
    const path = apiEndpoints.userSavedList.replace(/^\/?/, '/');
    const apiUrl = `${base}${path}`;

    const auth = request.headers.get('authorization') || '';

    const { data, status } = await axios.get(apiUrl, {
      params: { page, limit }, // let axios build the query string
      headers: {
        accept: '*/*',
        Authorization: auth, // forward "Bearer <token>"
      },
      // timeout: 10000,               // (optional) add a timeout
      // validateStatus: () => true,   // (optional) if you want to pass through non-2xx
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const payload = error?.response?.data || {
      message: error?.message || 'Internal Server Error',
    };
    console.error('GET /api/me/saved proxy failed:', payload);
    return NextResponse.json({ error: payload }, { status });
  }
}
