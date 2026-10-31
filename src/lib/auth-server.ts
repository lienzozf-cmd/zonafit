import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';

function getSessionSecret(): string {
  const secret = (process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (!secret) {
    throw new Error('CRITICAL SECURITY ERROR: Neither SESSION_SECRET nor ADMIN_PASSWORD_HASH is configured in environment.');
  }
  return secret;
}

export async function createSession(username: string): Promise<string> {
  const sessionSecret = getSessionSecret();
  
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({ username, expires });
  const payloadBase64 = Buffer.from(payload).toString('base64');
  
  const hmac = crypto.createHmac('sha256', sessionSecret).update(payloadBase64).digest('hex');
  const token = `${payloadBase64}.${hmac}`;
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return token;
}

export async function verifySession(): Promise<boolean> {
  try {
    const sessionSecret = (process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || '').trim();
    if (!sessionSecret) {
      console.error('CRITICAL: Cannot verify session, no secret key configured.');
      return false;
    }

    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!cookie || !cookie.value) {
      return false;
    }
    
    const parts = cookie.value.split('.');
    if (parts.length !== 2) {
      return false;
    }
    
    const [payloadBase64, signature] = parts;
    
    // Constant-time signature verification (prevents timing attacks)
    const expectedSignature = crypto.createHmac('sha256', sessionSecret).update(payloadBase64).digest('hex');
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return false;
    }
    
    // Verify expiration
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
    if (payload.expires && typeof payload.expires === 'number' && payload.expires > Date.now()) {
      return true;
    }
  } catch (e) {
    return false;
  }
  
  return false;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}
