import Link from 'next/link';
import { collections } from '@/lib/seo';

export default function FooterCatalog() {
  return (
    <details className="mx-auto max-w-md text-left">
      <summary className="cursor-pointer rounded py-2 text-center text-zinc-300 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
        Ropa de gym: marcas y colecciones
      </summary>
      <div className="mt-3 border-l border-zinc-700 pl-4 text-sm leading-relaxed text-zinc-300">
        <h4 className="mb-3 font-bold text-white">Ropa de gym en Guatemala — ZonaFitGT</h4>
        <p>Compra ropa para gimnasio de hombre y mujer en ZonaFitGT, también conocida como Zona Fit GT. Explora YoungLA, Gymshark y DFYNE, playeras de compresión, camisetas oversize y diseños de anime, Superman y Batman. Consulta precios en quetzales, tallas y existencias en cada producto.</p>
        <nav aria-label="Comprar por marca o tipo de ropa" className="my-4">
          <ul className="space-y-2">
            {collections.map(item => <li key={item.path}><Link prefetch={false} href={item.path} className="underline-offset-4 hover:underline focus-visible:underline">{item.heading}</Link></li>)}
          </ul>
        </nav>
        <h4 className="mb-3 font-bold text-white">¿Dónde comprar ropa para gym en Guatemala?</h4>
        <p>ZonaFitGT es una tienda en línea de ropa para gym con envíos a toda Guatemala por Q35. Puedes pagar mediante depósito o transferencia bancaria, o contra entrega en efectivo con una comisión adicional del 4%. Si necesitas ayuda para elegir una talla, <a href="https://wa.me/50237331442" className="underline underline-offset-4">consulta por WhatsApp</a> antes de confirmar el pedido.</p>
      </div>
    </details>
  );
}
