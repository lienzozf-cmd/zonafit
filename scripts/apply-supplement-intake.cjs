const fs = require('node:fs');
const assert = require('node:assert/strict');
const spec = require('./data/supplement-intake.json');
const receiptPath = 'scratch/supplement-intake-receipt.json';
const stockKey = v => `${v.product_id}:${v.color_name || ''}:${v.option_value}`;
assert.equal(spec.newProducts.length, 14);
assert.equal(spec.newProducts.flatMap(p => p.images).length, 17);
assert.equal(spec.variants.reduce((sum, v) => sum + v.stock, 0) + spec.restock.quantity, 48);
assert.equal(new Set(spec.variants.map(stockKey)).size, spec.variants.length);
for (const p of spec.newProducts) for (const i of p.images) assert(fs.existsSync('public' + i.src), i.src);
async function main() {
  console.table(spec.newProducts.map(p => ({ id: p.id, name: p.name, price: p.price, units: spec.variants.filter(v => v.product_id === p.id).reduce((s, v) => s + v.stock, 0), category: p.subcategory })));
  if (!process.argv.includes('--apply')) return console.log('Preview: 44 new units + 4 existing MuscleTech units. Apply after deployment.');
  if (fs.existsSync(receiptPath)) {
    const previous = JSON.parse(fs.readFileSync(receiptPath));
    if (previous.status === 'complete') return console.log('This intake was already applied; no stock added again.');
    throw new Error('An earlier intake attempt started. Review the receipt before resuming; do not add stock again.');
  }
  require('dotenv').config({ path: '.env.local', quiet: true });
  const { createClient } = require('@supabase/supabase-js');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const r = spec.restock;
  const { data: catalog, error: catalogError } = await db.from('products').select('id,name,brand');
  if (catalogError) throw catalogError;
  for (const p of spec.newProducts) {
    assert(!catalog.some(c => c.id === p.id), `Occupied product ID: ${p.id}`);
    assert(!catalog.some(c => c.name.toLowerCase() === p.name.toLowerCase() && c.brand.toLowerCase() === p.brand.toLowerCase()), `Existing product: ${p.name}`);
  }
  const { data: before, error: productError } = await db.from('products').select('*').eq('id', r.product_id).single();
  if (productError) throw productError;
  assert.equal(before.name, r.name);
  assert.equal(before.price, r.oldPrice);
  const { data: variantsBefore, error: variantError } = await db.from('product_variants').select('*').eq('product_id', r.product_id);
  if (variantError) throw variantError;
  const variant = variantsBefore.find(v => v.id === r.variant_id);
  assert(variant);
  assert.equal(variant.option_value, r.option_value);
  assert.equal(variantsBefore.length, 1);
  const nextStock = variant.stock + r.quantity;
  const receipt = { status: 'started', startedAt: new Date().toISOString(), before: { product: before, variants: variantsBefore }, expectedRestock: nextStock, addedUnits: 48, steps: [] };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2), { flag: 'wx' });
  function step(name) { receipt.steps.push(name); fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2)); }
  const rows = spec.newProducts.map(({ is_new, ...p }) => ({ ...p, visible: false }));
  const { error: insertError } = await db.from('products').insert(rows);
  if (insertError) throw insertError;
  step('Inserted 14 hidden products');
  const { error: stockError } = await db.from('product_variants').insert(spec.variants);
  if (stockError) throw stockError;
  step('Inserted 44 units across new variants');
  const { data: updatedVariant, error: restockError } = await db.from('product_variants').update({ stock: nextStock }).eq('id', variant.id).eq('stock', variant.stock).select('*').single();
  if (restockError) throw restockError;
  assert.deepEqual(updatedVariant, { ...variant, stock: nextStock });
  step('Added exactly 4 existing MuscleTech units');
  const options = structuredClone(before.options);
  const option = options.values.find(o => o.value === r.option_value);
  assert(option);
  option.stock = nextStock;
  const change = { price: r.price, options, availability: 'Disponible' };
  const { data: updatedProduct, error: updateError } = await db.from('products').update(change).eq('id', r.product_id).eq('price', before.price).select('*').single();
  if (updateError) throw updateError;
  for (const key of Object.keys(before)) {
    if (key === 'updated_at') continue;
    assert.deepEqual(updatedProduct[key], Object.hasOwn(change, key) ? change[key] : before[key], key);
  }
  step('Updated existing price to Q395 and preserved other metadata');
  const ids = spec.newProducts.map(p => p.id);
  const { error: showError } = await db.from('products').update({ visible: true }).in('id', ids);
  if (showError) throw showError;
  const { data: afterProducts, error: afterError } = await db.from('products').select('*').in('id', ids);
  if (afterError) throw afterError;
  const { data: afterVariants, error: afterVariantError } = await db.from('product_variants').select('*').in('product_id', ids);
  if (afterVariantError) throw afterVariantError;
  assert.equal(afterProducts.length, 14);
  assert.equal(afterVariants.length, spec.variants.length);
  for (const expected of spec.variants) {
    const actual = afterVariants.find(v => stockKey(v) === stockKey(expected));
    assert(actual, stockKey(expected));
    assert.equal(actual.stock, expected.stock, stockKey(expected));
  }
  for (const p of spec.newProducts) {
    const actual = afterProducts.find(a => a.id === p.id);
    for (const key of ['name','price','brand','category','subcategory','images','options','colors','visible']) assert.deepEqual(actual[key], p[key], `${p.id}.${key}`);
  }
  receipt.status = 'complete';
  receipt.completedAt = new Date().toISOString();
  receipt.after = { products: [...afterProducts, updatedProduct], variants: [...afterVariants, updatedVariant] };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify({ addedUnits: 48, newModels: 14, nutrexMonohydrateUnits: 10, muscleTechStockBefore: variant.stock, muscleTechStockAfter: nextStock, muscleTechPrice: updatedProduct.price, verified: true }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
