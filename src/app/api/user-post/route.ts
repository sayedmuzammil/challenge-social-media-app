import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Construct the API URL with query parameters
    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.userPostsList.replace(
      ':username',
      username
    )}?page=${page}&limit=${limit}`;

    console.log('apiUrl : ', apiUrl);

    const auth = request.headers.get('authorization') || '';

    const { data } = await axios.get(apiUrl, {
      headers: {
        accept: '*/*',
        Authorization: auth, // already "Bearer <token>"
      },
    });

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
