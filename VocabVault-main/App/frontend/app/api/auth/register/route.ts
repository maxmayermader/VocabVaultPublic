import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("body", body);
    const { username, email, password, first_name, last_name } = body;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
      username,
      email,
      password,
      first_name,
      last_name,
    });

    if (response.data) {
      return NextResponse.json({ success: true, message: 'User registered successfully' });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // This is an Axios error
      return NextResponse.json(
        { error: error.response?.data?.detail || 'Registration failed' },
        { status: error.response?.status || 500 }
      );
    } else {
      // This is not an Axios error
      console.error('Unexpected error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}