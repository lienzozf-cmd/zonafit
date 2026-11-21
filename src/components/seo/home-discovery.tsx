import Link from 'next/link';
import { collections } from '@/lib/seo';

export default function HomeDiscovery() {
  return (
    <section aria-labelledby="gym-shopping-title" className="container mx-auto max-w-6xl px-5 py-12 text-zinc-300 text-base leading-relaxed">
      <h2 id="gym-shopping-title" className="text-3xl sm:text-4xl font-black text-white mb-4">Ropa de gym en Guatemala — ZonaFitGT</h2>
      <p>Compra ropa para gimnasio de hombre y mujer en ZonaFitGT, también conocida como Zona Fit GT. Explora YoungLA, Gymshark y DFYNE, playeras de compresión, camisetas oversize y diseños de anime, Superman y Batman. Consulta precios en quetzales, tallas y existencias en cada producto.</p>
      <nav aria-label="Comprar por marca o tipo de ropa" className="mt-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map(item => <li key={item.path}><Link href={item.path} className="block rounded-lg border border-zinc-700 bg-zinc-950 p-4 underline underline-offset-4 hover:border-red-500 hover:text-white">{item.heading}</Link></li>)}
        </ul>
      </nav>
      <h2 className="text-xl font-bold text-white mt-8 mb-3">¿Dónde comprar ropa para gym en Guatemala?</h2>
      <p>ZonaFitGT es una tienda en línea de ropa para gym con envíos a toda Guatemala por Q35. Puedes pagar mediante depósito o transferencia bancaria, o contra entrega en efectivo con una comisión adicional del 4%. Si necesitas ayuda para elegir una talla, <a href="https://wa.me/50237331442" className="underline underline-offset-4">consulta por WhatsApp</a> antes de confirmar el pedido.</p>
    </section>
  );
}
