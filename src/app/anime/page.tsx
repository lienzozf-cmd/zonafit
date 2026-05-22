import ProductGridPage from '@/components/product-grid-page';
import { products, type Product } from '@/lib/data';

const animeKeywords = [
  'inosuke', 'tanjiro', 'nezuko', 'zenitsu', 'uzui', 
  'yu-gi-oh', 'itachi', 'gojo', 'sukuna', 'anime',
  'jujutsu kaisen', 'demon slayer', 'mago oscuro',
  'dark magician', 'blue eyes', 'gogeta', 'broly',
  'aot', 'attack on titan', 'shingeki', 'levi'
];

function isAnimeProduct(product: Product): boolean {
  const nameLower = product.name.toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  
  const matchesKeyword = animeKeywords.some(keyword => 
    nameLower.includes(keyword) || descLower.includes(keyword)
  );

  if (matchesKeyword) return true;

  if (product.images && product.images.length > 0) {
    const hasAnimeImageHint = product.images.some(img => 
      (img.dataAiHint || '').toLowerCase().includes('anime')
    );
    if (hasAnimeImageHint) return true;
  }

  return false;
}

export default function AnimePage() {
  const filteredProducts = products.filter(isAnimeProduct);

  return (
    <ProductGridPage
      products={filteredProducts}
      title="Colección Anime"
    />
  );
}
