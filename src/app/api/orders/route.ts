import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders-db';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders in API:', error);
    return NextResponse.json({ error: error.message || 'Error fetching orders' }, { status: 500 });
  }
}
