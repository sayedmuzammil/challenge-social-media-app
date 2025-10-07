import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiEndpoints } from '../../endpoints';

export async function POST(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  try {
    const postIdParam = context.params.postId;

    if (!postIdParam) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const apiUrl = `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }${apiEndpoints.likePostById.replace(':postId', postIdParam)}`;

    console.log('apiUrl : ', apiUrl);

    const auth = request.headers.get('authorization') || '';

    // axios version
    const { data } = await axios.post(apiUrl, null, {
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
