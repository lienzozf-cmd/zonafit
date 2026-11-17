/** Parse catalog prices such as Q.704.00 without treating Q.'s dot as a decimal. */
export function parseCatalogPrice(price: string | number | undefined): number {
  if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
  if (!price) return 0;
  const normalized = price.trim().replace(/^Q\.?\s*/i, '').replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return 0;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}
