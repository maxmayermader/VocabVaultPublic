import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function GET(request: NextRequest) {
  const access = request.cookies.get('token')?.value;

  if (!access) {
    return NextResponse.json(
      { message: "Login first to load user" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (response.data) {
      return NextResponse.json({ user: response.data });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // This is an Axios error
      return NextResponse.json(
        { error: "Something went wrong while retrieving user" },
        { status: error.response?.status || 500 }
      );
    } else {
      // This is not an Axios error
      console.error('Unexpected error:', error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}