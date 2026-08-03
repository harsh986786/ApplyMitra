import { NextResponse } from 'next/server';

export function json(body: any, status = 200) {
  return NextResponse.json(body, { status });
}

export function errorResponse(err: any, fallback = 'Internal server error') {
  if (err && typeof err === 'object' && 'status' in err) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: err.status });
  }
  console.error('[api] error:', err);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function readBody(req: Request): Promise<any> {
  try {
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
