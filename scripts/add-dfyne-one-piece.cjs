// Stage the product hidden until its images have been deployed. Run --publish afterwards.
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('dotenv').config({ path: '.env.local', quiet: true });
const { createClient } = require('@supabase/supabase-js');
async function main() {
  const product = JSON.parse(fs.readFileSync('src/lib/products.json')).find(p => p.id === 9115);
  assert.equal(product.name, 'Impact Long Sleeve One Piece');
  assert.equal(product.price, 'Q.995.00');
  const expected = { Truffle: 'S', 'Electric Blue': 'XS', Espresso: 'XS', 'Winter Berry': 'S' };
  assert.equal(product.colors.length, 4);
  for (const color of product.colors) {
    assert.equal(color.options.values.length, 1);
    assert.equal(color.options.values[0].value, expected[color.name]);
    assert.equal(color.options.values[0].stock, 1);
  }
  for (const image of product.images) assert(fs.existsSync('public' + image.src));
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: existing, error: lookupError } = await db.from('products').select('*').eq('id', product.id).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    assert.equal(existing.name, product.name);
    assert.equal(existing.brand, product.brand);
  } else {
    const { data: duplicates, error: duplicateError } = await db.from('products').select('id').eq('name', product.name).eq('brand', product.brand);
    if (duplicateError) throw duplicateError;
    assert.equal(duplicates.length, 0, 'Product already exists under another ID');
    const { is_new, ...dbProduct } = product;
    const { error } = await db.from('products').insert({ ...dbProduct, visible: false });
    if (error) throw error;
  }
  const { data: existingVariants, error: variantError } = await db.from('product_variants').select('*').eq('product_id', product.id);
  if (variantError) throw variantError;
  const missing = product.colors.filter(c => !existingVariants.some(v => v.color_name === c.name && v.option_value === expected[c.name]));
  if (missing.length) {
    const { error } = await db.from('product_variants').insert(missing.map(c => ({ product_id: product.id, color_name: c.name, option_value: expected[c.name], stock: 1 })));
    if (error) throw error;
  }
  const { data: variants, error: verifyError } = await db.from('product_variants').select('color_name,option_value,stock').eq('product_id', product.id).order('color_name');
  if (verifyError) throw verifyError;
  assert.equal(variants.length, 4);
  for (const v of variants) {
    assert.equal(v.option_value, expected[v.color_name]);
    assert.equal(v.stock, 1, 'Stock changed; do not reset sales');
  }
  if (process.argv.includes('--publish')) {
    const { data, error } = await db.from('products').update({ visible: true }).eq('id', product.id).select('id,name,price,category,subcategory,gender,visible').single();
    if (error) throw error;
    console.log(JSON.stringify(data));
  }
  console.table(variants);
  console.log('Verified four units, Q995 each. No existing stock was reset.');
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
