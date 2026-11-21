import Link from 'next/link';
import { absoluteUrl, serializeJsonLd } from '@/lib/seo';

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-zinc-300">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              <Link prefetch={false} href={item.path} aria-current={index === items.length - 1 ? 'page' : undefined}
                className="underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                {item.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
      }) }} />
    </>
  );
}
