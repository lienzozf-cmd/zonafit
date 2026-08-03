import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth-server';

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}

// Support GET for simple links/redirects if needed
export async function GET() {
  await destroySession();
  return NextResponse.json({ success: true });
}
