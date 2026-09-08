import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function compare() {
  const localProducts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/lib/products.json'), 'utf-8'));
  
  const { data: dbVariants } = await supabase
    .from('product_variants')
    .select('*');

  if (!dbVariants) {
    console.log('No se pudieron obtener variantes de la BD');
    return;
  }

  // Map db variants by key
  const dbMap = new Map<string, number>();
  for (const v of dbVariants) {
    const key = `${v.product_id}|${v.color_name || ''}|${v.option_value}`;
    dbMap.set(key, v.stock);
  }

  // Check local stock vs DB stock
  let stockDiscrepancies = 0;
  const discrepancies: any[] = [];

  for (const p of localProducts) {
    if (p.colors && p.colors.length > 0) {
      for (const col of p.colors) {
        for (const opt of (col.options?.values || [])) {
          const key = `${p.id}|${col.name}|${opt.value}`;
          const dbStock = dbMap.get(key);
          const localStock = opt.stock ?? 0;
          if (dbStock !== undefined && dbStock !== localStock) {
            stockDiscrepancies++;
            if (discrepancies.length < 15) {
              discrepancies.push({
                product_id: p.id,
                name: p.name,
                color: col.name,
                option: opt.value,
                dbStock,
                localStock
              });
            }
          }
        }
      }
    } else if (p.options?.values) {
      for (const opt of p.options.values) {
        const key = `${p.id}||${opt.value}`;
        const dbStock = dbMap.get(key);
        const localStock = opt.stock ?? 0;
        if (dbStock !== undefined && dbStock !== localStock) {
          stockDiscrepancies++;
          if (discrepancies.length < 15) {
            discrepancies.push({
              product_id: p.id,
              name: p.name,
              color: 'N/A',
              option: opt.value,
              dbStock,
              localStock
            });
          }
        }
      }
    }
  }

  console.log('--- COMPARACIÓN READ-ONLY BD VS PRODUCTS.JSON ---');
  console.log(`Discrepancias de stock encontradas entre BD y archivo local products.json: ${stockDiscrepancies}`);
  if (discrepancies.length > 0) {
    console.log('Muestra de discrepancias (donde la BD real tiene stock diferente a products.json):');
    console.table(discrepancies);
  }
}

compare().catch(console.error);
