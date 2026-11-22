# SEO y descubrimiento de ZonaFitGT

## Implementación

- `src/lib/seo.ts` centraliza el dominio canónico `https://www.zonafitgt.com` (sobrescribible con `SEO_SITE_URL`, independiente del antiguo `NEXT_PUBLIC_BASE_URL` de Firebase) y el contenido de diez colecciones: hombre, mujer, YoungLA, Gymshark, DFYNE, compresión, oversize, anime, Superman y Batman.
- Las colecciones tienen título, descripción, canonical, Open Graph, texto visible, enlaces internos, breadcrumbs y CollectionPage/ItemList. La portada enlaza estas páginas.
- Las fichas entregan nombre, descripción, precio, imagen y opciones en el HTML del servidor; la interacción y la actualización de stock siguen en el cliente.
- El servidor y `/api/products` comparten `loadPublicCatalog`. Los datos SEO se revalidan cada 60 segundos. Durante un fallo de base de datos se usa el catálogo local sin publicar ofertas estructuradas no verificadas.
- Se retiraron las reseñas/calificaciones fijas, identificadores de fabricante inventados y fechas de vencimiento no respaldadas del marcado Product. Precio y disponibilidad estructurados usan el catálogo consultado.
- `sitemap.xml` incluye las rutas públicas y productos visibles del catálogo. No inventa fechas de modificación. Al crear otra ruta pública, actualizar `src/lib/sitemap-routes.ts`.
- `robots.txt` permite rastrear contenido público y excluye API, administración y checkout. No se añadieron bloqueos a Googlebot, Bingbot, OAI-SearchBot ni otros rastreadores de búsqueda. Revisar también el firewall/CDN del hosting.
- `/llms.txt` ofrece un índice opcional de información pública. No es requisito de indexación ni asegura recomendaciones.

## Verificación

```sh
pnpm run typecheck
pnpm run build
pnpm run start -p 3100
node scripts/check-seo.mjs http://localhost:3100
```

El comprobador verifica once páginas, encabezados únicos, canonical, descripciones, enlaces de producto en HTML inicial, JSON-LD, precios/existencias de muestra contra la API, sitemap, robots, llms.txt y HTTP 404 de productos inexistentes. Requiere las variables de Supabase ya utilizadas por la aplicación y acceso de lectura a su catálogo. No crea pedidos ni modifica stock.

## Activación en producción

1. Publicar mediante el flujo habitual del proyecto. Estas modificaciones locales por sí solas no alteran el sitio público. El flujo habitual es publicar en `main` de `lienzozf-cmd/zonafit`; Vercel despliega automáticamente. Comprobar el estado del commit y ejecutar el verificador contra el dominio público después del despliegue.
2. Verificar `https://www.zonafitgt.com` en Google Search Console y enviar `https://www.zonafitgt.com/sitemap.xml`. Inspeccionar portada, las tres marcas, las colecciones y una ficha de producto con la prueba de URL publicada.
3. Verificar el sitio en Bing Webmaster Tools y enviar el mismo sitemap. Confirmar que el hosting no bloquee los rastreadores de búsqueda por IP o por desafíos automáticos.
4. Validar una ficha con Google Rich Results Test. Registrar impresiones, clics, consultas, páginas de entrada y compras pagadas antes de comparar resultados. Un pedido iniciado o enviado no equivale a un pago confirmado.
5. Considerar Google Merchant Center después de comprobar elegibilidad del país y políticas de la cuenta; no se ha creado cuenta ni feed en este cambio.

No hay garantía de posición, indexación, tráfico, ventas ni recomendaciones por una IA. Google indica que las prácticas habituales de SEO aplican a sus funciones de IA; no exige archivos especiales. OpenAI recomienda permitir OAI-SearchBot y sus IP publicadas para optar a aparecer en búsquedas de ChatGPT. Las plataformas deciden qué resultados mostrar.

Fuentes:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.openai.com/api/docs/bots
