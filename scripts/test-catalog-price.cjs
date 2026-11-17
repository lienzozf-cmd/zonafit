const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/catalog-price.ts', 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {} };
vm.runInNewContext(outputText, context);
const { parseCatalogPrice } = context.exports;
for (const [input, expected] of [
  ['Q.704.00', 704], ['Q.656.00', 656], ['Q.1,360.00', 1360],
  ['Q 704.50', 704.5], ['Q704.00', 704], ['704.00', 704], [704, 704],
  [undefined, 0], ['', 0], ['Q.abc', 0], ['704.00.50', 0], [Infinity, 0],
]) assert.equal(parseCatalogPrice(input), expected, String(input));
const subtotal = parseCatalogPrice('Q.704.00') + parseCatalogPrice('Q.656.00');
assert.equal(subtotal, 1360);
assert.equal(subtotal + 35, 1395);
assert.equal(subtotal + 35 + Math.round(subtotal * 0.04), 1449);
console.log('Catalog price regression checks passed (including order 000120).');
