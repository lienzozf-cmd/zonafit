import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';

export async function createSession(username: string) {
  const expectedHash = (process.env.ADMIN_PASSWORD_HASH || 'dc3de1eabf18e69a972e2c34de309168e7cffcd50f059d4f34109f918bf85015').trim();
  
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({ username, expires });
  const payloadBase64 = Buffer.from(payload).toString('base64');
  
  const hmac = crypto.createHmac('sha256', expectedHash).update(payloadBase64).digest('hex');
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
  const expectedHash = (process.env.ADMIN_PASSWORD_HASH || 'dc3de1eabf18e69a972e2c34de309168e7cffcd50f059d4f34109f918bf85015').trim();
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
  
  // Verify signature
  const expectedSignature = crypto.createHmac('sha256', expectedHash).update(payloadBase64).digest('hex');
  if (signature !== expectedSignature) {
    return false;
  }
  
  // Verify expiration
  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
    if (payload.expires && payload.expires > Date.now()) {
      return true;
    }
  } catch (e) {
    return false;
  }
  
  return false;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}
