import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data: dbVariants } = await supabase.from('product_variants').select('*');
  const sumVariantsStock = dbVariants?.reduce((acc, v) => acc + (v.stock || 0), 0);
  console.log('Sum of product_variants.stock:', sumVariantsStock);

  const localProducts = JSON.parse(fs.readFileSync('src/lib/products.json', 'utf-8'));
  let sumLocal = 0;
  const missingFromVariants: any[] = [];
  const variantKeys = new Set(dbVariants?.map(v => `${v.product_id}:${(v.color_name || '').trim()}:${(v.option_value || '').trim()}`));

  for (const p of localProducts) {
    if (p.colors && p.colors.length > 0) {
      for (const col of p.colors) {
        for (const opt of (col.options?.values || [])) {
          sumLocal += (opt.stock || 0);
          const k = `${p.id}:${(col.name || '').trim()}:${(opt.value || '').trim()}`;
          if (!variantKeys.has(k)) {
            missingFromVariants.push({ pId: p.id, name: p.name, color: col.name, opt: opt.value, stock: opt.stock });
          }
        }
      }
    } else if (p.options?.values) {
      for (const opt of p.options.values) {
        sumLocal += (opt.stock || 0);
        const k = `${p.id}::${(opt.value || '').trim()}`;
        if (!variantKeys.has(k)) {
          missingFromVariants.push({ pId: p.id, name: p.name, color: 'N/A', opt: opt.value, stock: opt.stock });
        }
      }
    }
  }

  console.log('Sum of localProducts stock:', sumLocal);
  console.log('Options in products that were NOT in product_variants table:');
  console.table(missingFromVariants);
}
check();
