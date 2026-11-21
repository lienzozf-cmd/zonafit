import Link from 'next/link';
import { collections, type CollectionSeo } from '@/lib/seo';

export default function CollectionContent({ entry }: { entry: CollectionSeo }) {
  return (
    <section aria-label="Guía de compra" className="mt-12 border-t border-zinc-800 pt-8 text-zinc-300 text-base leading-relaxed">
      <h2 className="text-xl font-bold text-white mb-3">Compra en ZonaFitGT con envío en Guatemala</h2>
      <p>{entry.intro}</p>
      <p className="mt-3">Los precios se muestran en quetzales. El envío nacional cuesta Q35. Puedes elegir depósito o transferencia bancaria, o pago contra entrega en efectivo con una comisión adicional del 4%. Revisa el total antes de confirmar tu pedido.</p>
      <h2 className="text-xl font-bold text-white mt-6 mb-3">Antes de elegir tu prenda</h2>
      <p>Consulta las tallas y colores de cada producto. Si necesitas ayuda con el ajuste o la disponibilidad, <a className="underline underline-offset-4 hover:text-white" href="https://wa.me/50237331442">pregúntanos por WhatsApp</a>. Revisa también las <Link prefetch={false} className="underline underline-offset-4 hover:text-white" href="/terminos-y-condiciones#devoluciones">condiciones de cambios y devoluciones</Link>.</p>
      <nav aria-label="Otras marcas y colecciones" className="mt-6">
        <h2 className="text-xl font-bold text-white mb-3">Explora más ropa para gym</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {collections.filter(item => item.path !== entry.path).map(item => (
            <li key={item.path}><Link prefetch={false} href={item.path} className="underline underline-offset-4 hover:text-white">{item.heading}</Link></li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
