import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import type { Product } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch all products
    const { data: dbProducts, error: productsError } = await supabaseServer
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('id', { ascending: true });
      
    if (productsError) throw productsError;
    
    // 2. Fetch all variants (to merge stock info)
    const { data: dbVariants, error: variantsError } = await supabaseServer
      .from('product_variants')
      .select('*');
      
    if (variantsError) throw variantsError;
    
    // Create a lookup map for variant stock
    const stockMap = new Map<string, number>();
    (dbVariants || []).forEach(v => {
      const color = v.color_name || '';
      const key = `${v.product_id}:${color}:${v.option_value}`;
      stockMap.set(key, v.stock);
    });
    
    // 3. Merge stock and compute availability
    const products: Product[] = (dbProducts || []).map((p: any) => {
      const product = {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price,
        availability: p.availability,
        description: p.description,
        gender: p.gender,
        category: p.category,
        subcategory: p.subcategory,
        brand: p.brand,
        fabric_type: p.fabric_type,
        is_compression: p.is_compression,
        images: p.images,
        options: p.options,
        colors: p.colors,
        feature1: p.feature1,
        feature2: p.feature2,
        feature3: p.feature3,
        feature4: p.feature4,
        benefits: p.benefits,
        servings_info: p.servings_info,
        visible: p.visible,
      } as Product;
      
      let totalStock = 0;
      
      // Update options values with stock from variants table
      if (product.options && product.options.values) {
        product.options.values = product.options.values.map(opt => {
          const key = `${product.id}::${opt.value}`; // color_name is empty
          const stock = stockMap.get(key) ?? 0;
          totalStock += stock;
          return {
            ...opt,
            stock
          };
        });
      }
      
      // Update colors options values with stock from variants table
      if (product.colors && product.colors.length > 0) {
        product.colors = product.colors.map(col => {
          if (col.options && col.options.values) {
            col.options.values = col.options.values.map(opt => {
              const key = `${product.id}:${col.name}:${opt.value}`;
              const stock = stockMap.get(key) ?? 0;
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
      
      product.availability = totalStock > 0 ? 'Disponible' : 'Agotado';
      
      // Apply 5% discount to all in-stock tank top products ("thanks")
      if (product.subcategory === 'tank' && product.availability === 'Disponible') {
        const cleanPriceStr = product.price.replace('Q.', '').replace(/,/g, '').trim();
        const originalNumeric = parseFloat(cleanPriceStr);
        if (!isNaN(originalNumeric)) {
          const discountedNumeric = Math.round(originalNumeric * 0.95 * 100) / 100;
          product.price = `Q.${discountedNumeric.toFixed(2)}`;
          product.originalPrice = `Q.${originalNumeric.toFixed(2)}`;
        }
      }

      return product;
    });
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products from Supabase API:', error);
    return NextResponse.json([], { status: 500 });
  }
}
