// Run without arguments to preview; --apply updates only the reviewed metadata.
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: '.env.local', quiet: true });
const { createClient } = require('@supabase/supabase-js');
const corrections = new Map([
  [2620, { before: 'equipo', after: 'llavero' }],
  [2655, { before: 'aminoacidos', after: 'bienestar' }],
  [2658, { before: 'proteina', after: 'bienestar' }],
  [9103, { before: 'sudadera', after: 'chamarra' }],
  [9112, { before: 'playera', after: 'camiseta' }],
  [9113, { before: 'playera', after: 'camiseta' }],
]);
async function main() {
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await client.from('products').select('*').order('id');
  if (error) throw error;
  const preview = data.filter(p => corrections.has(p.id)).map(p => {
    const change = corrections.get(p.id);
    if (![change.before, change.after].includes(p.subcategory)) throw new Error(`Unexpected category for ${p.id}; review before updating.`);
    return { id: p.id, name: p.name, before: p.subcategory, after: change.after };
  });
  if (preview.length !== corrections.size) throw new Error('Missing reviewed products');
  console.table(preview);
  if (!process.argv.includes('--apply')) return;
  const dir = path.join('scratch', `category-update-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'before.json'), JSON.stringify(data, null, 2));
  for (const p of preview) {
    if (p.before === p.after) continue;
    const { data: updated, error } = await client.from('products')
      .update({ subcategory: p.after }).eq('id', p.id).eq('subcategory', p.before).select('id');
    if (error) throw error;
    if (updated.length !== 1) throw new Error(`Concurrent change or denied update: ${p.id}`);
  }
  const { data: after, error: readError } = await client.from('products').select('*').order('id');
  if (readError) throw readError;
  for (const p of after) {
    if (corrections.has(p.id) && p.subcategory !== corrections.get(p.id).after) throw new Error(`Verification failed: ${p.id}`);
    const before = data.find(old => old.id === p.id);
    // Verify our updates did not alter stock, prices, images, or other fields.
    for (const key of Object.keys(before)) {
      if (key === 'subcategory' || key === 'updated_at') continue;
      if (JSON.stringify(before[key]) !== JSON.stringify(p[key])) throw new Error(`Other data changed concurrently: ${p.id}.${key}`);
    }
  }
  fs.writeFileSync(path.join(dir, 'after.json'), JSON.stringify(after, null, 2));
  console.log(`Verified ${preview.length} category corrections. Backup and final catalog: ${dir}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
