import { NextResponse } from 'next/server';
import crypto from 'crypto';
import argon2 from 'argon2';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createSession } from '@/lib/auth-server';

async function verifyAdminPassword(cleanPassword: string, expectedHash: string): Promise<boolean> {
  if (!cleanPassword || !expectedHash) return false;

  // 1. Argon2 verification (recommended and modern standard)
  if (expectedHash.startsWith('$argon2')) {
    try {
      return await argon2.verify(expectedHash, cleanPassword);
    } catch (err) {
      console.error('Error during argon2 verification:', err);
      return false;
    }
  }

  // 2. Legacy fallback for SHA-256 (if environment variable still uses legacy SHA-256)
  try {
    const computedHash = crypto.createHash('sha256').update(cleanPassword).digest('hex');
    const computedBuffer = Buffer.from(computedHash, 'utf8');
    const expectedBuffer = Buffer.from(expectedHash, 'utf8');
    if (computedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(computedBuffer, expectedBuffer)) {
      return true;
    }
  } catch (err) {
    console.error('Error during legacy hash comparison:', err);
  }

  return false;
}

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
    const expectedHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();

    if (!expectedHash) {
      console.error('CRITICAL: ADMIN_PASSWORD_HASH is not set in environment variables.');
      return NextResponse.json({ error: 'Configuración de autenticación no disponible en el servidor' }, { status: 500 });
    }

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const isUserValid = cleanUsername === expectedUsername;
    const isPasswordValid = isUserValid ? await verifyAdminPassword(cleanPassword, expectedHash) : false;

    if (isUserValid && isPasswordValid) {
      // Create session and set cookie
      await createSession(cleanUsername);
      return NextResponse.json({ success: true });
    } else {
      console.warn('Admin login failed: Invalid credentials attempt from IP');
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error in admin login API:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
