import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/services/services';
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

    const auth = request.headers.get('authorization') || '';

    // axios version
    // const { data } = await axios.get(apiUrl);
    // return NextResponse.json(data);

    // fetch version
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { accept: '*/*' },
      // cache: 'no-store', // uncomment if you always want fresh data
    });

    const text = await response.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // leave as text if not JSON
      data = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            (data && (data.error || data.message)) || `HTTP ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      'Failed to get Feed : ',
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: error.response?.data || 'Internal Server Error',
      },
      { status: error.response?.status || 500 }
    );
  }
}
