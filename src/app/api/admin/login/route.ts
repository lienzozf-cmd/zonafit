import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createSession } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    // Apply Rate Limiting: max 20 login attempts per 15 minutes
    const ip = await getClientIp();
    const limiter = rateLimit(ip, 20, 15 * 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.' },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();
    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const expectedUsername = (process.env.ADMIN_USERNAME || 'zonafitero').trim().toLowerCase();
    const expectedHash = (process.env.ADMIN_PASSWORD_HASH || 'dc3de1eabf18e69a972e2c34de309168e7cffcd50f059d4f34109f918bf85015').trim();

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    // Compute SHA-256 hash of the incoming password
    const computedHash = crypto.createHash('sha256').update(cleanPassword).digest('hex');

    if (cleanUsername === expectedUsername && computedHash === expectedHash) {
      // Create session and set cookie
      await createSession(cleanUsername);
      return NextResponse.json({ success: true });
    } else {
      console.warn('Admin login mismatch:', { cleanUsername, expectedUsername, matchUsername: cleanUsername === expectedUsername, matchHash: computedHash === expectedHash });
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error in admin login API:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
