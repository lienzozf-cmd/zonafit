import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth-server';

// Strictly restrict logout to POST to prevent CSRF attacks via image or link prefetching
export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
