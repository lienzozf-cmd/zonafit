# Reducción de solicitudes CDN

## Cambios

- Los consumidores del catálogo comparten un refresco y una ventana de frescura de 30 segundos. No se vuelven a aplicar snapshots guardados: las actualizaciones de stock por Supabase Realtime se conservan.
- Checkout y la finalización de un pedido fuerzan una lectura nueva. Si una lectura anterior sigue activa, el refresco forzado se ejecuta después. Los errores no marcan datos como frescos y conservan el catálogo visible.
- `/api/products` permite caché privada del navegador durante 15 segundos. No se almacena en la caché compartida del CDN. La petición forzada usa `cache: reload`.
- Se desactivan precargas automáticas en navegación, enlaces SEO, banners, colecciones y enlaces de cookies. Los enlaces siguen siendo navegables e indexables.
- El carrusel monta cada banner cuando se visita por primera vez y conserva los ya visitados. La portada empieza con la imagen de Demon Slayer; Spider-Man y los otros banners se cargan al mostrarse. No se eliminan sus animaciones, audio ni compra.
- Las tarjetas de producto usan imágenes diferidas por defecto; las dos primeras de una página de catálogo pueden tener prioridad. La imagen principal de una ficha mantiene su prioridad.
- `/assets/*` tiene caché de navegador durante siete días, sin `immutable`. Si se sustituye una imagen y se necesita actualización inmediata, usar un nombre o URL versionado nuevo.

## Verificación

- Compilación de producción aislada con dependencias publicadas.
- `node scripts/check-catalog-refresh.mjs`: concurrencia, expiración, conservación de stock realtime, refresco forzado, refresco después de una lectura anterior y reintento de errores.
- `node scripts/check-seo.mjs http://localhost:3104`: once páginas, cuatro ofertas contrastadas con la API, sitemap de 137 productos y HTTP 404.
- Encabezados HTTP comprobados: catálogo `private, max-age=15, must-revalidate`; logo estático `public, max-age=604800`.
- Una sesión de prueba local contada mediante proxy HTTP registró una petición a `/api/products` para marca → ficha, y una segunda forzada al entrar a checkout. Las únicas páginas RSC solicitadas fueron las navegadas explícitamente (ficha y checkout).
- Carrito, confeti y navegación al formulario verificados sin crear un pedido. No hubo errores de consola en esa prueba.

Estos resultados son de una prueba local. No representan una reducción porcentual medida sobre todo el tráfico público ni descuentan solicitudes ya consumidas.

## Pendiente de acceso a Vercel

La integración de Vercel fue encontrada pero no estaba conectada durante la revisión. El panel privado previamente pidió login. Por tanto, aún no se ha obtenido el ranking de rutas, IP, países, agentes o proyectos del consumo real, ni se han modificado reglas WAF.

Cuando exista acceso:

1. En Usage, filtrar el proyecto `zonafit` y comparar períodos completos antes/después. Separar CDN Requests, transferencias e invocaciones; caché del CDN no elimina por sí sola una solicitud CDN.
2. En Firewall/Observability, identificar volumen, rutas, IP y bots. Usar inicialmente observación/log cuando corresponda y no bloquear por un User-Agent declarado como único criterio.
3. Aplicar mitigaciones WAF específicas para tráfico confirmado abusivo, preservando compradores, endpoints de pedidos, assets, Googlebot, Bingbot y rastreadores de búsqueda de IA verificados. Revisar casos concretos de rastreadores de IA antes de desafiar tráfico automatizado de forma global.
4. Verificar el efecto con tráfico real y falsos positivos. No usar middleware de la aplicación como sustituto de mitigación WAF para ahorrar solicitudes CDN.

Vercel explica que el tráfico mitigado por WAF no incurre en CDN Requests ni Fast Data Transfer: https://vercel.com/changelog/web-application-firewall-mitigated-traffic-is-free-on-vercel

Bots verificados: https://vercel.com/docs/bot-management
