import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'zonafitero';
    const expectedHash = process.env.ADMIN_PASSWORD_HASH || '9dfdc3ac308890874f19fd521c8ae9ef7e69ba5768705625c8770f0bf5e57a67';

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    // Compute SHA-256 hash of the incoming password
    const computedHash = crypto.createHash('sha256').update(password).digest('hex');

    if (username === expectedUsername && computedHash === expectedHash) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error in admin login API:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
