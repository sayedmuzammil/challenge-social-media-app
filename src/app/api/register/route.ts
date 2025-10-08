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
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Error:', err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
