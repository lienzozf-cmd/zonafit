import { NextResponse } from 'next/server';
import { loadPublicCatalog } from '@/lib/public-catalog';
import { SPIDERMAN_PRODUCTS } from '@/lib/spiderman-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allProducts = await loadPublicCatalog();

    return NextResponse.json(allProducts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Error fetching products from Supabase API:', error);
    return NextResponse.json(SPIDERMAN_PRODUCTS, { status: 500 });
  }
}
