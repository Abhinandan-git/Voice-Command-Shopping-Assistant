import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:3001/items';

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/items', '');
  const url = `${API_URL}${path}`;

  try {
    const body = req.body ? await req.json().catch(() => null) : null;
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as DELETE, handler as PUT, handler as PATCH };