const assert = require('node:assert/strict');
const fs = require('node:fs');
const spec = require('./data/dfyne-expansion.json');
const patches = spec.patches;
const allNewVariants = [
  ...patches.flatMap(p => p.additions.map(a => ({ product_id: p.id, color_name: a.color.name, option_value: a.color.options.values[0].value, stock: 1 }))),
  ...spec.newProducts.flatMap(p => p.colors.map(c => ({ product_id: p.id, color_name: c.name, option_value: c.options.values[0].value, stock: 1 }))),
];
const imageList = [...patches.flatMap(p => [...p.additions.flatMap(a => a.images), ...p.extraImages]), ...spec.newProducts.flatMap(p => p.images)];
assert.equal(imageList.length, 15);
assert.equal(new Set(imageList.map(i => i.src)).size, 15);
assert.equal(allNewVariants.length, 10);
for (const image of imageList) assert(fs.existsSync('public' + image.src), image.src);
async function main() {
  console.table(allNewVariants);
  if (!process.argv.includes('--apply')) return console.log('Preview only. Apply after images are deployed.');
  require('dotenv').config({ path: '.env.local', quiet: true });
  const { createClient } = require('@supabase/supabase-js');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ids = [...patches.map(p => p.id), ...spec.newProducts.map(p => p.id)];
  const { data: before, error } = await db.from('products').select('*').in('id', ids);
  if (error) throw error;
  const { data: oldVariants, error: variantError } = await db.from('product_variants').select('*').in('product_id', ids);
  if (variantError) throw variantError;
  const backup = `scratch/dfyne-expansion-${Date.now()}-before.json`;
  fs.writeFileSync(backup, JSON.stringify({ products: before, variants: oldVariants }, null, 2));
  for (const change of patches) {
    const p = before.find(p => p.id === change.id);
    assert.equal(p.name, change.name);
    assert([change.oldPrice, change.price].includes(p.price), `Unexpected price: ${p.id}`);
  }
  for (const p of spec.newProducts) {
    const existing = before.find(x => x.id === p.id);
    if (existing) {
      assert.equal(existing.name, p.name);
      assert.equal(existing.brand, p.brand);
    } else {
      const { data: duplicates, error: duplicateError } = await db.from('products').select('id').eq('name', p.name).eq('brand', p.brand);
      if (duplicateError) throw duplicateError;
      assert.equal(duplicates.length, 0, `Duplicate model ${p.name}`);
    }
  }
  for (const p of spec.newProducts) {
    if (before.some(x => x.id === p.id)) continue;
    const { is_new, ...row } = p;
    const { error } = await db.from('products').insert({ ...row, visible: false });
    if (error) throw error;
  }
  const missing = allNewVariants.filter(v => !oldVariants.some(old => old.product_id === v.product_id && old.color_name === v.color_name && old.option_value === v.option_value));
  if (missing.length) {
    const { error } = await db.from('product_variants').insert(missing);
    if (error) throw error;
  }
  const expectedUpdates = new Map();
  for (const change of patches) {
    const p = before.find(p => p.id === change.id);
    const colors = [...(p.colors || [])];
    const images = [...(p.images || [])];
    for (const addition of change.additions) {
      if (!colors.some(c => c.name === addition.color.name)) colors.push(addition.color);
      for (const image of addition.images) if (!images.some(i => i.src === image.src)) images.push(image);
    }
    for (const image of change.extraImages) if (!images.some(i => i.src === image.src)) images.push(image);
    const update = { price: change.price, colors, images };
    const { error } = await db.from('products').update(update).eq('id', p.id).eq('price', p.price);
    if (error) throw error;
    expectedUpdates.set(p.id, update);
  }
  for (const p of spec.newProducts) {
    const { error } = await db.from('products').update({ visible: true }).eq('id', p.id);
    if (error) throw error;
  }
  const { data: after, error: afterError } = await db.from('products').select('*').in('id', ids);
  if (afterError) throw afterError;
  const { data: variants, error: afterVariantError } = await db.from('product_variants').select('*').in('product_id', ids);
  if (afterVariantError) throw afterVariantError;
  for (const old of oldVariants) assert.deepEqual(variants.find(v => v.id === old.id), old, 'Existing inventory changed concurrently; investigate without resetting');
  for (const v of allNewVariants) {
    const actual = variants.find(a => a.product_id === v.product_id && a.color_name === v.color_name && a.option_value === v.option_value);
    assert(actual);
    if (missing.includes(v)) assert.equal(actual.stock, 1);
  }
  for (const p of before.filter(p => expectedUpdates.has(p.id))) {
    const actual = after.find(a => a.id === p.id);
    const update = expectedUpdates.get(p.id);
    for (const key of Object.keys(p)) {
      if (key === 'updated_at') continue;
      assert.deepEqual(actual[key], Object.hasOwn(update, key) ? update[key] : p[key], `${p.id}.${key}`);
    }
  }
  for (const p of spec.newProducts) {
    const actual = after.find(a => a.id === p.id);
    for (const key of ['name', 'price', 'brand', 'gender', 'category', 'subcategory', 'images', 'colors', 'visible']) assert.deepEqual(actual[key], p[key]);
  }
  fs.writeFileSync(backup.replace('-before', '-after'), JSON.stringify({ products: after, variants }, null, 2));
  console.table(after.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.subcategory, visible: p.visible })));
  console.log(`Verified 15 images, 10 new variants and preserved all existing inventory. Backup: ${backup}`);
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
