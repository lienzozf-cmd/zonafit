import productsData from '../src/lib/products.json';

const animeKeywords = [
  'inosuke', 'tanjiro', 'nezuko', 'zenitsu', 'uzui', 
  'yu-gi-oh', 'itachi', 'gojo', 'sukuna', 'anime',
  'jujutsu kaisen', 'demon slayer', 'mago oscuro',
  'dark magician', 'blue eyes', 'gogeta', 'broly',
  'aot', 'attack on titan', 'shingeki', 'levi'
];

function isAnimeProduct(product: any): boolean {
  const nameLower = product.name.toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  
  const matchesKeyword = animeKeywords.some(keyword => 
    nameLower.includes(keyword) || descLower.includes(keyword)
  );

  if (matchesKeyword) return true;

  if (product.images && product.images.length > 0) {
    const hasAnimeImageHint = product.images.some((img: any) => 
      (img.dataAiHint || '').toLowerCase().includes('anime')
    );
    if (hasAnimeImageHint) return true;
  }

  return false;
}

const animeProducts = productsData.filter(isAnimeProduct);

console.log(`Found ${animeProducts.length} anime products:`);
animeProducts.forEach((p: any) => {
  console.log(`- ID: ${p.id} | Name: ${p.name} | Subcategory: ${p.subcategory} | Brand: ${p.brand}`);
});
