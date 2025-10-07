import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function GET(request: NextRequest) {
  try {
    // Construct the API URL with query parameters
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.userStats}`;

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
      'Failed to get stats : ',
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
