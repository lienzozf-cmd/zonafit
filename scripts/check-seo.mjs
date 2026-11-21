import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://localhost:3100';
const origin = process.env.SEO_SITE_URL || 'https://www.zonafitgt.com';
const paths = ['/', '/hombres', '/mujeres', '/marcas/youngla', '/marcas/gymshark', '/marcas/dfyne', '/hombres/playeras/compresion', '/hombres/playeras/oversize', '/anime', '/coleccion/superman', '/coleccion/batman'];
const read = async path => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response.text();
};
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const titles = new Set();
for (const path of paths) {
  const html = await read(path);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, `${path}: title`);
  assert.ok(!titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one server-rendered h1`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical && new URL(canonical).href, new URL(path, origin).href, `${path}: canonical`);
  assert.match(html, /name="description" content="[^"]+"/, `${path}: description`);
  const data = schemas(html);
  if (path !== '/') {
    const collection = data.find(item => item['@type'] === 'CollectionPage');
    assert.ok(collection, `${path}: CollectionPage`);
    assert.ok(collection.mainEntity.numberOfItems > 0, `${path}: nonempty catalog`);
    for (const item of collection.mainEntity.itemListElement) {
      assert.ok(new RegExp(`href="${new URL(item.url).pathname}(?:[?]|")`).test(html), `${path}: crawlable product ${item.url}`);
    }
    assert.ok(data.some(item => item['@type'] === 'BreadcrumbList'), `${path}: breadcrumbs`);
  }
}
const products = JSON.parse(await read('/api/products'));
const inStock = product => product.availability !== 'Agotado' && (product.colors?.length ? product.colors.flatMap(color => color.options?.values || []) : product.options?.values || []).some(option => option.stock > 0);
const samples = [products.find(inStock), products.find(product => !inStock(product)), products.find(product => /batman/i.test(product.name)), products.find(product => product.id === 9112)].filter(Boolean);
for (const product of samples) {
  const html = await read(`/product/${product.id}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `product ${product.id}: visible server content`);
  assert.ok(!html.includes('Cargando producto...'), `product ${product.id}: no JS loading shell`);
  const schema = schemas(html).find(item => item['@type'] === 'Product');
  assert.equal(schema.name, product.name);
  assert.ok(!schema.aggregateRating && !schema.review && !schema.mpn, 'No fabricated reviews or manufacturer identifiers');
  assert.ok(schema.offers, `product ${product.id}: verified live offer`);
  const price = Number(product.price.replace(/^Q\.?\s*/i, '').replace(/,/g, '').trim());
  assert.equal(Number(schema.offers.price), price, `product ${product.id}: live price`);
  assert.equal(schema.offers.availability, `https://schema.org/${inStock(product) ? 'InStock' : 'OutOfStock'}`);
}
const sitemap = await read('/sitemap.xml');
for (const path of paths) assert.ok(sitemap.includes(`<loc>${new URL(path, origin).href}</loc>`), `sitemap: ${path}`);
for (const product of products) assert.ok(sitemap.includes(`/product/${product.id}</loc>`), `sitemap: product ${product.id}`);
assert.ok(!sitemap.includes('<lastmod>'), 'No synthetic modification dates');
assert.ok(!sitemap.includes('/admin</loc>') && !sitemap.includes('/checkout</loc>'));
const robots = await read('/robots.txt');
assert.match(robots, /User-Agent: \*\nAllow: \//);
assert.match(robots, /Sitemap: https:\/\//);
assert.match(await read('/llms.txt'), /ZonaFitGT/);
const invalid = await fetch(new URL('/product/999999999', base));
assert.equal(invalid.status, 404, 'Unknown products must return HTTP 404');
console.log(`SEO checks passed: ${paths.length} pages, ${samples.length} live product offers, sitemap (${products.length} products), robots, llms.txt and HTTP 404.`);
