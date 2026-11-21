import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product-detail';
import { getSeoCatalog } from '@/lib/seo-catalog';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products } = await getSeoCatalog();
  const product = products.find(item => String(item.id) === id && item.visible !== false);
  if (!product) notFound();
  return <ProductDetail key={id} initialProduct={product} />;
}
