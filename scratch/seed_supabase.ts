import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function main() {
  console.log('Starting migration to Supabase...');
  
  const productsFilePath = path.join(__dirname, '../src/lib/products.json');
  if (!fs.existsSync(productsFilePath)) {
    console.error(`Error: File not found at ${productsFilePath}`);
    process.exit(1);
  }

  const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  console.log(`Loaded ${productsData.length} products from products.json`);

  // Clear existing data (optional, but good for idempotent seed)
  console.log('Cleaning existing database entries...');
  const { error: deleteVariantsError } = await supabase.from('product_variants').delete().neq('option_value', 'TRUNCATE_BYPASS');
  if (deleteVariantsError) console.error('Warning deleting variants:', deleteVariantsError.message);
  
  const { error: deleteProductsError } = await supabase.from('products').delete().neq('availability', 'TRUNCATE_BYPASS');
  if (deleteProductsError) console.error('Warning deleting products:', deleteProductsError.message);

  // We will insert in batches to avoid payload limits
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < productsData.length; i += BATCH_SIZE) {
    const batch = productsData.slice(i, i + BATCH_SIZE);
    
    // 1. Prepare products for insertion
    const dbProducts = batch.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      original_price: p.originalPrice || null,
      availability: p.availability || 'Disponible',
      description: p.description || null,
      gender: p.gender || null,
      category: p.category || null,
      subcategory: p.subcategory || null,
      brand: p.brand || null,
      fabric_type: p.fabric_type || null,
      is_compression: p.is_compression || false,
      images: p.images || [],
      options: p.options || { type: 'talla', values: [] },
      colors: p.colors || [],
      feature1: p.feature1 || null,
      feature2: p.feature2 || null,
      feature3: p.feature3 || null,
      feature4: p.feature4 || null,
      benefits: p.benefits || null,
      servings_info: p.servings_info || null,
      visible: p.visible !== false
    }));

    console.log(`Inserting products batch ${i / BATCH_SIZE + 1}...`);
    const { error: productsError } = await supabase.from('products').insert(dbProducts);
    if (productsError) {
      console.error('Error inserting products batch:', productsError);
      process.exit(1);
    }

    // 2. Prepare variants for insertion
    const dbVariants: any[] = [];
    
    batch.forEach((p: any) => {
      if (p.colors && p.colors.length > 0) {
        p.colors.forEach((color: any) => {
          const colorName = color.name;
          const options = color.options?.values || [];
          options.forEach((opt: any) => {
            dbVariants.push({
              product_id: p.id,
              color_name: colorName,
              option_value: opt.value,
              stock: typeof opt.stock === 'number' ? opt.stock : 0
            });
          });
        });
      } else if (p.options && p.options.values && p.options.values.length > 0) {
        p.options.values.forEach((opt: any) => {
          dbVariants.push({
            product_id: p.id,
            color_name: null,
            option_value: opt.value,
            stock: typeof opt.stock === 'number' ? opt.stock : 0
          });
        });
      } else {
        // Fallback variant if no colors/options exist
        dbVariants.push({
          product_id: p.id,
          color_name: null,
          option_value: 'Único',
          stock: 0
        });
      }
    });

    if (dbVariants.length > 0) {
      console.log(`Inserting variants batch ${i / BATCH_SIZE + 1} (${dbVariants.length} variants)...`);
      const { error: variantsError } = await supabase.from('product_variants').insert(dbVariants);
      if (variantsError) {
        console.error('Error inserting variants batch:', variantsError);
        process.exit(1);
      }
    }
  }

  console.log('Migration completed successfully!');
}

main().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
