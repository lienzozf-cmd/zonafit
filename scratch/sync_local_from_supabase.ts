import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncLocalWithSupabase() {
  console.log('1. Consultando Supabase EN VIVO ahora mismo...');
  
  // Obtener todas las variantes de Supabase
  const { data: dbVariants, error: varErr } = await supabase
    .from('product_variants')
    .select('*')
    .order('product_id', { ascending: true });

  if (varErr || !dbVariants) {
    console.error('Error al obtener variantes de Supabase:', varErr);
    process.exit(1);
  }

  // Obtener productos de Supabase para ver nombres y datos
  const { data: dbProducts, error: prodErr } = await supabase
    .from('products')
    .select('id, name, availability, visible')
    .order('id', { ascending: true });

  if (prodErr || !dbProducts) {
    console.error('Error al obtener productos de Supabase:', prodErr);
    process.exit(1);
  }

  console.log(`Variantes recuperadas de Supabase: ${dbVariants.length}`);
  console.log(`Productos recuperados de Supabase: ${dbProducts.length}`);

  // Guardar snapshot de los datos exactos que acabamos de leer de Supabase
  const liveSnapshotPath = path.join(process.cwd(), 'scratch', `supabase_live_read_${Date.now()}.json`);
  fs.writeFileSync(liveSnapshotPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalVariants: dbVariants.length,
    variants: dbVariants,
    products: dbProducts
  }, null, 2));
  console.log(`Snapshot en vivo guardado en: ${liveSnapshotPath}`);

  // Leer products.json actual
  const productsJsonPath = path.join(process.cwd(), 'src/lib/products.json');
  const localProducts = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));

  // Respaldar products.json antes de cualquier cambio
  const backupJsonPath = path.join(process.cwd(), 'src/lib/products.backup.json');
  fs.writeFileSync(backupJsonPath, JSON.stringify(localProducts, null, 2));
  console.log(`Respaldo de products.json creado en: ${backupJsonPath}`);

  // Crear mapa de stock de Supabase
  // Llaves:
  // Con color: `${productId}:${colorName.trim()}:${optionValue.trim()}`
  // Sin color: `${productId}::${optionValue.trim()}`
  const dbStockMap = new Map<string, number>();
  for (const v of dbVariants) {
    const color = (v.color_name || '').trim();
    const opt = (v.option_value || '').trim();
    const key = `${v.product_id}:${color}:${opt}`;
    dbStockMap.set(key, v.stock);
  }

  // Ahora mapeamos y actualizamos localProducts con la verdad absoluta de Supabase
  let updatedVariantsCount = 0;
  let notFoundInDbCount = 0;
  const changesList: any[] = [];
  const notFoundList: any[] = [];

  for (const product of localProducts) {
    let productTotalStock = 0;

    if (product.colors && product.colors.length > 0) {
      for (const col of product.colors) {
        if (col.options && col.options.values) {
          for (const opt of col.options.values) {
            const colorName = (col.name || '').trim();
            const optVal = (opt.value || '').trim();
            const key = `${product.id}:${colorName}:${optVal}`;
            
            if (dbStockMap.has(key)) {
              const realStock = dbStockMap.get(key)!;
              if (opt.stock !== realStock) {
                changesList.push({
                  productId: product.id,
                  productName: product.name,
                  color: colorName,
                  option: optVal,
                  oldStock: opt.stock,
                  newRealStock: realStock
                });
                opt.stock = realStock;
                updatedVariantsCount++;
              }
              productTotalStock += realStock;
            } else {
              notFoundInDbCount++;
              notFoundList.push({
                productId: product.id,
                productName: product.name,
                color: colorName,
                option: optVal,
                currentStock: opt.stock
              });
              productTotalStock += (opt.stock || 0);
            }
          }
        }
      }
    } else if (product.options && product.options.values) {
      for (const opt of product.options.values) {
        const optVal = (opt.value || '').trim();
        const key = `${product.id}::${optVal}`;

        if (dbStockMap.has(key)) {
          const realStock = dbStockMap.get(key)!;
          if (opt.stock !== realStock) {
            changesList.push({
              productId: product.id,
              productName: product.name,
              color: 'N/A',
              option: optVal,
              oldStock: opt.stock,
              newRealStock: realStock
            });
            opt.stock = realStock;
            updatedVariantsCount++;
          }
          productTotalStock += realStock;
        } else {
          notFoundInDbCount++;
          notFoundList.push({
            productId: product.id,
            productName: product.name,
            color: 'N/A',
            option: optVal,
            currentStock: opt.stock
          });
          productTotalStock += (opt.stock || 0);
        }
      }
    }

    // Actualizar disponibilidad del producto en base al stock real
    // Si tiene 0 unidades totales, marcar como Agotado; si tiene > 0, Disponible
    const previousAvailability = product.availability;
    product.availability = productTotalStock > 0 ? 'Disponible' : 'Agotado';
    if (previousAvailability !== product.availability) {
      console.log(`Disponibilidad de #${product.id} (${product.name}) cambió de '${previousAvailability}' a '${product.availability}' (Stock total: ${productTotalStock})`);
    }
  }

  console.log(`\nResumen de actualización:`);
  console.log(`- Variantes actualizadas en products.json: ${updatedVariantsCount}`);
  console.log(`- Variantes no encontradas en DB (si hubiera): ${notFoundInDbCount}`);
  
  if (changesList.length > 0) {
    console.log('\nCambios aplicados a products.json desde Supabase:');
    console.table(changesList.slice(0, 30));
    if (changesList.length > 30) {
      console.log(`... y ${changesList.length - 30} cambios más.`);
    }
  } else {
    console.log('No hubo diferencias entre Supabase y products.json.');
  }

  if (notFoundList.length > 0) {
    console.log('\nVariantes en products.json que no estaban en product_variants de Supabase:');
    console.table(notFoundList);
  }

  // Guardar el archivo products.json actualizado
  fs.writeFileSync(productsJsonPath, JSON.stringify(localProducts, null, 2));
  console.log('\n✅ products.json actualizado con éxito con los datos reales de Supabase.');
  console.log('🔒 Supabase NO fue modificado en lo absoluto (operación 100% de lectura hacia Supabase).');
}

syncLocalWithSupabase().catch(console.error);
