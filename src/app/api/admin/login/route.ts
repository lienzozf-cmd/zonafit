import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createSession } from '@/lib/auth-server';

async function verifyAdminPassword(cleanPassword: string, expectedHash: string): Promise<boolean> {
  if (!cleanPassword || !expectedHash) return false;

  // 1. Scrypt / PBKDF2 formatted hash (e.g. scrypt:salt:derivedKey)
  if (expectedHash.startsWith('scrypt:')) {
    try {
      const [, salt, key] = expectedHash.split(':');
      if (salt && key) {
        const derivedKey = crypto.scryptSync(cleanPassword, salt, 64).toString('hex');
        const keyBuffer = Buffer.from(key, 'hex');
        const derivedBuffer = Buffer.from(derivedKey, 'hex');
        if (keyBuffer.length === derivedBuffer.length && crypto.timingSafeEqual(keyBuffer, derivedBuffer)) {
          return true;
        }
      }
    } catch (err) {
      console.error('Error during scrypt verification:', err);
    }
  }

  // 2. SHA-256 with constant-time verification (timingSafeEqual prevents timing attacks)
  try {
    const computedHash = crypto.createHash('sha256').update(cleanPassword).digest('hex');
    const computedBuffer = Buffer.from(computedHash, 'utf8');
    const expectedBuffer = Buffer.from(expectedHash, 'utf8');
    if (computedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(computedBuffer, expectedBuffer)) {
      return true;
    }
  } catch (err) {
    console.error('Error during password hash comparison:', err);
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
