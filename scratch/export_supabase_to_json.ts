import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function exportSupabaseToProductsJson() {
  console.log('--- EXPORTANDO ESTADO REAL DE SUPABASE A PRODUCTS.JSON (SOLO LECTURA DE SUPABASE) ---');
  
  // 1. Fetch all products from Supabase
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
    
  if (productsError) {
    console.error('Error fetching products:', productsError);
    process.exit(1);
  }
  
  // 2. Fetch all variants from Supabase
  const { data: dbVariants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*');
    
  if (variantsError) {
    console.error('Error fetching variants:', variantsError);
    process.exit(1);
  }
  
  // Create lookup map for stock
  const stockMap = new Map<string, number>();
  (dbVariants || []).forEach(v => {
    const color = (v.color_name || '').trim();
    const opt = (v.option_value || '').trim();
    const key = `${v.product_id}:${color}:${opt}`;
    stockMap.set(key, Number(v.stock) || 0);
  });
  
  // 3. Reconstruct full products list identical to api/products/route.ts
  let totalStockInEntireStore = 0;
  let inStockProductsCount = 0;
  let outOfStockProductsCount = 0;

  const products = (dbProducts || []).map((p: any) => {
    const product: any = {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.original_price || undefined,
      availability: p.availability,
      description: p.description,
      gender: p.gender,
      category: p.category,
      subcategory: p.subcategory,
      brand: p.brand,
      fabric_type: p.fabric_type || undefined,
      is_compression: p.is_compression || false,
      images: p.images || [],
      options: p.options || { type: 'talla', values: [] },
      colors: p.colors || [],
      feature1: p.feature1 || undefined,
      feature2: p.feature2 || undefined,
      feature3: p.feature3 || undefined,
      feature4: p.feature4 || undefined,
      benefits: p.benefits || undefined,
      servings_info: p.servings_info || undefined,
      visible: p.visible !== false,
    };
    
    let totalStock = 0;
    
    // Merge options stock from variants table
    if (product.options && product.options.values) {
      product.options.values = product.options.values.map((opt: any) => {
        const key = `${product.id}::${(opt.value || '').trim()}`;
        const stock = stockMap.has(key) ? stockMap.get(key)! : (opt.stock ?? 0);
        totalStock += stock;
        return {
          ...opt,
          stock
        };
      });
    }
    
    // Merge colors options stock from variants table
    if (product.colors && product.colors.length > 0) {
      product.colors = product.colors.map((col: any) => {
        if (col.options && col.options.values) {
          col.options.values = col.options.values.map((opt: any) => {
            const key = `${product.id}:${(col.name || '').trim()}:${(opt.value || '').trim()}`;
            const stock = stockMap.has(key) ? stockMap.get(key)! : (opt.stock ?? 0);
            totalStock += stock;
            return {
              ...opt,
              stock
            };
          });
        }
        return col;
      });
    }
    
    // Determine exact availability
    product.availability = totalStock > 0 ? 'Disponible' : 'Agotado';
    if (totalStock > 0) inStockProductsCount++;
    else outOfStockProductsCount++;
    
    totalStockInEntireStore += totalStock;
    return product;
  });

  console.log(`✅ Productos procesados: ${products.length}`);
  console.log(`   - Productos Disponibles: ${inStockProductsCount}`);
  console.log(`   - Productos Agotados: ${outOfStockProductsCount}`);
  console.log(`🔢 Stock total sumado en products.json: ${totalStockInEntireStore}`);

  // Escribir a products.json
  const targetPath = path.join(process.cwd(), 'src/lib/products.json');
  fs.writeFileSync(targetPath, JSON.stringify(products, null, 2));
  console.log(`\n💾 Archivo ${targetPath} guardado exitosamente.`);
}

exportSupabaseToProductsJson().catch(console.error);
