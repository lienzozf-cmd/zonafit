const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const context = { exports: {}, console };
  vm.runInNewContext(outputText, context);
  return context.exports;
}
const { categoryFilters: filters } = load('src/lib/category-filters.ts');
const products = [...JSON.parse(fs.readFileSync('src/lib/products.json')), ...load('src/lib/spiderman-products.ts').SPIDERMAN_PRODUCTS];
const byId = new Map(products.map(p => [p.id, p]));
for (const id of [9112, 9113]) {
  const p = byId.get(id);
  assert(filters['hombres-camisetas'](p), `Devant ${id} must have a category`);
  assert(!filters['hombres-oversize'](p));
  assert(!filters['hombres-compresion'](p));
}
for (const id of [2614, 9106, 9107]) {
  const p = byId.get(id);
  assert(filters['hombres-playeras'](p));
  assert(filters['hombres-oversize'](p));
  assert(filters['mujeres-tops'](p));
}
assert(filters['hombres-tanks'](byId.get(3031)));
assert(filters['hombres-compresion'](byId.get(3031)));
assert(!filters['hombres-tanks'](byId.get(2612)), 'Cut-off hoodie is not a tank');
assert(!filters['mujeres-bras'](byId.get(3057)));
assert(!filters['mujeres'](byId.get(8)), 'Unisex supplements are not women clothing');
assert(filters['hombres-chamarras'](byId.get(9103)));
assert(filters['accesorios-llaveros'](byId.get(2620)));
assert(!filters['accesorios-equipo'](byId.get(2620)));
for (const id of [2655, 2658]) {
  assert(filters['suplementos-bienestar'](byId.get(id)));
  assert(!filters['suplementos-proteinas'](byId.get(id)));
  assert(!filters['suplementos-aminoacidos'](byId.get(id)));
}
// A word inside a name must not override a known garment/supplement type.
assert(!filters['mujeres-bras']({ ...byId.get(3057), name: 'Cobra Top' }));
assert(!filters['suplementos-proteinas']({ ...byId.get(2655), name: 'Isotonic Sleep' }));
assert(!filters['hombres-oversize']({ ...byId.get(9112), name: 'New Training Tee', description: '', feature1: '', feature2: '', feature3: '', feature4: '' }));
const leafKeys = Object.keys(filters).filter(k => /^(hombres|mujeres|accesorios|suplementos|joyeria)-/.test(k) && !['hombres-playeras', 'mujeres-blusas', 'accesorios-pachones-shakers', 'accesorios-mochilas-maletas'].includes(k));
function audit(catalog) {
  for (const p of catalog) {
    assert(leafKeys.some(k => filters[k](p)), `Uncategorized: ${p.id} ${p.name}`);
    if (p.category === 'ropa' && ['hombre', 'unisex'].includes(p.gender) && ['playera', 'camiseta'].includes(p.subcategory)) {
      assert.equal(['hombres-camisetas', 'hombres-compresion', 'hombres-oversize'].filter(k => filters[k](p)).length, 1, `Ambiguous shirt: ${p.id}`);
    }
  }
}
audit(products);
if (process.argv[2]) audit(JSON.parse(fs.readFileSync(process.argv[2])));
console.log(`Category checks passed: ${products.length} local products, complete subcategory coverage and shirt fit exclusivity.`);
