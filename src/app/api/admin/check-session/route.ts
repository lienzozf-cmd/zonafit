import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function GET() {
  const authenticated = await verifySession();
  return NextResponse.json({ authenticated });
}
