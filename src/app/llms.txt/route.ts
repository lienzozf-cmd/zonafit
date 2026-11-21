import { collections, absoluteUrl } from '@/lib/seo';

// Optional discovery aid; llms.txt is not a requirement for Google or AI search.
export function GET() {
  const content = [
    '# ZonaFitGT — ropa de gym en Guatemala',
    '',
    '> ZonaFitGT (Zona Fit GT) es una tienda en línea de ropa para gimnasio, accesorios y suplementos con envíos en Guatemala.',
    '',
    'Los precios se muestran en GTQ. Consulta cada ficha para conocer precio, talla, color y disponibilidad actuales.',
    'Envío nacional: Q35. Métodos de pago: depósito o transferencia bancaria y contra entrega en efectivo con 4% adicional.',
    'Contacto: https://wa.me/50237331442',
    '',
    '## Catálogo por marca y tipo de ropa',
    ...collections.map(item => `- [${item.heading}](${absoluteUrl(item.path)}): ${item.description}`),
    '',
    '## Información de compra',
    `- [Condiciones y devoluciones](${absoluteUrl('/terminos-y-condiciones')})`,
    `- [Privacidad](${absoluteUrl('/politicas-de-privacidad')})`,
    `- [Sitemap del catálogo](${absoluteUrl('/sitemap.xml')})`,
    '',
  ].join('\n');
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
