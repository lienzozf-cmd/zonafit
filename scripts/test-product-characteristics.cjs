const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/product-characteristics.ts', 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const { getProductCharacteristics: features } = context.exports;
const catalog = JSON.parse(fs.readFileSync('src/lib/products.json'));
const find = id => catalog.find(p => p.id === id);
for (const p of catalog.filter(p => p.category !== 'ropa')) {
  const facts = features(p);
  assert(facts.length > 0 && facts.length <= 4);
  for (const fact of facts) {
    assert(fact.text?.trim(), `Empty fact: ${p.id}`);
    assert(!/corte atlético|costuras|fibras|tela:|transpirable|soporte y ajuste/i.test(fact.tag + ' ' + fact.text), `Clothing text on ${p.id}`);
  }
}
assert.deepEqual(JSON.parse(JSON.stringify(features(find(9121)))), [
  { tag: 'TIPO DE PRODUCTO', text: 'Multivitamínico' },
  { tag: 'PRESENTACIÓN', text: '60 capletas' },
  { tag: 'FORMATO', text: 'Capletas' },
  { tag: 'MARCA', text: 'Mutant' },
]);
assert(features(find(9124)).some(f => f.text === '450 mg'));
assert(features(find(9132)).some(f => f.text === '3 mg'));
assert(features(find(9120)).some(f => f.text === '300 g'));
assert(features(find(9120)).some(f => f.text === 'Sin sabor'));
assert(features(find(9125), find(9125).colors[1]).some(f => f.tag === 'SABOR' && f.text === 'Cherry Limeade'));
assert(features(find(9126)).some(f => f.text === 'Shaker'));
assert(features(find(9115)).some(f => f.tag === 'SOPORTE Y AJUSTE'));
// Missing supplement data must omit unknown facts rather than borrow clothing defaults.
const sparse = { ...find(9121), name: 'Suplemento', brand: '', options: {type:'Presentación',values:[]}, colors: [], servings_info: null };
assert.equal(features(sparse).length, 1);
console.log('Product characteristics passed: category-specific facts, no empty cards or clothing text on supplements/accessories.');
