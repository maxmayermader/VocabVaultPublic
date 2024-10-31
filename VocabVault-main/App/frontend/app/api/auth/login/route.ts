import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios'; 
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
      username,
      password,
    });

    if (response.data.access) {
      // Set the token as an HTTP-only cookie
      const res = NextResponse.json({ success: true, user: response.data.user });
      res.cookies.set('token', response.data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      return res;
    } else {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.detail || 'An error occurred' },
        { status: error.response?.status || 500 }
      );
    } else {
      // Handle other types of errors
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}