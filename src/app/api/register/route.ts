import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../endpoints';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, phone, password } = body;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}${apiEndpoints.register}`,
      { name, email, username, phone, password },
      {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      }
    );
    console.log('Register response : ', response);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Failed to register : ',
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
