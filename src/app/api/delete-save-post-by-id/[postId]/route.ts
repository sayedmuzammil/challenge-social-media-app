import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../../endpoints';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // Await the params
    const { postId: postIdParam } = await context.params;

    if (!postIdParam) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.deleteSavePostById.replace(':postId', postIdParam)}`;

    console.log('apiUrl : ', apiUrl);

    const auth = request.headers.get('authorization') || '';
    // axios version
    const { data } = await axios.delete(apiUrl, {
      method: 'DELETE', // 👈 UNSAVE = DELETE (upstream)
      headers: {
        accept: '*/*',
        Authorization: auth,
      },
    });
    return NextResponse.json(data);

    // fetch version
    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     accept: '*/*',
    //     'Content-Type': 'application/json',
    //     Authorization: auth,
    //   },
    // });
    // return NextResponse.json(response);
  } catch (err: unknown) {
    let message = 'Internal Server Error';
    if (err instanceof Error && err.message) message = err.message;
    console.error('Error:', err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
