import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders-db';
import { verifySession } from '@/lib/auth-server';

export async function GET() {
  try {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado. Se requiere inicio de sesión de administrador.' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders in API:', error);
    return NextResponse.json({ error: error.message || 'Error fetching orders' }, { status: 500 });
  }
}
