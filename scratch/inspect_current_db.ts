import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectDatabase() {
  console.log('====================================================');
  console.log('📊 REVISIÓN DE BASE DE DATOS SUPABASE (SOLO LECTURA)');
  console.log('Fecha de consulta:', new Date().toISOString());
  console.log('Supabase URL:', supabaseUrl);
  console.log('====================================================\n');

  // 1. Conteo de Productos
  const { count: totalProducts, error: countErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Error contando productos:', countErr.message);
  } else {
    console.log(`📦 Total de productos en tabla 'products': ${totalProducts}`);
  }

  // 1b. Conteo de productos visibles vs no visibles
  const { count: visibleProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('visible', true);
  console.log(`   - Visibles: ${visibleProducts}`);
  console.log(`   - Ocultos / no visibles: ${(totalProducts ?? 0) - (visibleProducts ?? 0)}`);

  // 2. Conteo y análisis de Variantes y Stock
  const { data: variants, error: varErr } = await supabase
    .from('product_variants')
    .select('id, product_id, color_name, option_value, stock');

  if (varErr) {
    console.error('Error obteniendo variantes:', varErr.message);
  } else if (variants) {
    const totalVariants = variants.length;
    let totalStockUnits = 0;
    let inStockVariants = 0;
    let outOfStockVariants = 0;
    const stockByProduct = new Map<number, number>();

    for (const v of variants) {
      const s = Number(v.stock) || 0;
      totalStockUnits += s;
      if (s > 0) inStockVariants++;
      else outOfStockVariants++;

      stockByProduct.set(v.product_id, (stockByProduct.get(v.product_id) || 0) + s);
    }

    console.log(`\n🏷️ Total de variantes en 'product_variants': ${totalVariants}`);
    console.log(`   - Variantes con stock > 0: ${inStockVariants}`);
    console.log(`   - Variantes agotadas (stock = 0): ${outOfStockVariants}`);
    console.log(`🔢 Unidades totales de inventario (suma total de stock): ${totalStockUnits}`);

    // Productos con stock vs sin stock
    let productsWithStock = 0;
    let productsWithoutStock = 0;
    for (const [, s] of stockByProduct.entries()) {
      if (s > 0) productsWithStock++;
      else productsWithoutStock++;
    }
    console.log(`\n📦 Resumen por producto (de ${stockByProduct.size} productos con variantes registradas):`);
    console.log(`   - Productos con al menos 1 unidad en stock: ${productsWithStock}`);
    console.log(`   - Productos con stock total = 0: ${productsWithoutStock}`);

    // Muestra de las variantes con mayor stock
    const sortedByStock = [...variants].sort((a, b) => b.stock - a.stock);
    console.log('\n🔝 Top 10 variantes con mayor stock:');
    sortedByStock.slice(0, 10).forEach((v, idx) => {
      console.log(`   ${idx + 1}. Prod #${v.product_id} | Color: ${v.color_name || 'N/A'} | Talla/Opción: ${v.option_value} -> Stock: ${v.stock}`);
    });
  }

  // 3. Revisión de Pedidos (Orders)
  const { data: orders, count: totalOrders, error: ordErr } = await supabase
    .from('orders')
    .select('order_id, client_name, order_total, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(10);

  if (ordErr) {
    console.error('Error revisando órdenes:', ordErr.message);
  } else {
    console.log(`\n🛒 Total de órdenes en tabla 'orders': ${totalOrders}`);
    if (orders && orders.length > 0) {
      console.log('🕒 Últimas órdenes registradas:');
      orders.forEach(o => {
        console.log(`   - Orden #${o.order_id} | Cliente: ${o.client_name || 'Sin nombre'} | Total: Q${o.order_total} | Fecha: ${o.created_at}`);
      });
    }
  }

  // 4. Guardar un snapshot de solo lectura de los stocks actuales para referencia de seguridad
  if (variants) {
    const backupSnapshotPath = path.join(process.cwd(), 'scratch', `stock_snapshot_current_${Date.now()}.json`);
    fs.writeFileSync(backupSnapshotPath, JSON.stringify(variants, null, 2));
    console.log(`\n💾 Snapshot de seguridad de solo lectura guardado en: ${backupSnapshotPath}`);
  }

  console.log('\n====================================================');
  console.log('✅ REVISIÓN COMPLETADA SIN NINGUNA MODIFICACIÓN');
  console.log('====================================================');
}

inspectDatabase().catch(console.error);
