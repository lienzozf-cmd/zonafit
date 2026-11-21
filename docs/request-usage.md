# Reducción de solicitudes CDN

## Cambios

- Los consumidores del catálogo comparten un refresco y una ventana de frescura de 30 segundos. No se vuelven a aplicar snapshots guardados: las actualizaciones de stock por Supabase Realtime se conservan.
- Checkout y la finalización de un pedido fuerzan una lectura nueva. Si una lectura anterior sigue activa, el refresco forzado se ejecuta después. Los errores no marcan datos como frescos y conservan el catálogo visible.
- `/api/products` permite caché privada del navegador durante 15 segundos. No se almacena en la caché compartida del CDN. La petición forzada usa `cache: reload`.
- Se desactivan precargas automáticas en navegación, enlaces SEO, banners, colecciones y enlaces de cookies. Los enlaces siguen siendo navegables e indexables.
- El carrusel monta cada banner cuando se visita por primera vez y conserva los ya visitados. La portada empieza con la imagen de Demon Slayer; Spider-Man y los otros banners se cargan al mostrarse. No se eliminan sus animaciones, audio ni compra.
- Las tarjetas de producto usan imágenes diferidas por defecto; las dos primeras de una página de catálogo pueden tener prioridad. La imagen principal de una ficha mantiene su prioridad.
- `/assets/*` tiene caché de navegador durante siete días, sin `immutable`. Si se sustituye una imagen y se necesita actualización inmediata, usar un nombre o URL versionado nuevo.

- Marcas, accesorios, joyería y suplementos usan catálogo compartido y revalidación cada 60 segundos en lugar de renderizado forzado por visita.
- El enlace de checkout vacío también desactiva `prefetch`.
- `robots.txt` se genera desde `src/app/robots.ts` y pide a GPTBot, OAI-SearchBot, CCBot y Bytespider no rastrear. Se conserva el acceso público de otros buscadores. Es una instrucción voluntaria, no una regla WAF; bloquear OAI-SearchBot limita la presencia en búsquedas de ChatGPT.

## Verificación

- Compilación de producción aislada con dependencias publicadas.
- `node scripts/check-catalog-refresh.mjs`: concurrencia, expiración, conservación de stock realtime, refresco forzado, refresco después de una lectura anterior y reintento de errores.
- `node scripts/check-seo.mjs http://localhost:3104`: once páginas, cuatro ofertas contrastadas con la API, sitemap de 137 productos y HTTP 404.
- Encabezados HTTP comprobados: catálogo `private, max-age=15, must-revalidate`; logo estático `public, max-age=604800`.
- Una sesión de prueba local contada mediante proxy HTTP registró una petición a `/api/products` para marca → ficha, y una segunda forzada al entrar a checkout. Las únicas páginas RSC solicitadas fueron las navegadas explícitamente (ficha y checkout).
- Carrito, confeti y navegación al formulario verificados sin crear un pedido. No hubo errores de consola en esa prueba.

Estos resultados son de una prueba local. No representan una reducción porcentual medida sobre todo el tráfico público ni descuentan solicitudes ya consumidas.

## Tráfico compartido desde Vercel

Las capturas y tablas aportadas por el propietario muestran 11.6k solicitudes en un día desde AS16509 (Amazon), con muchas visitas repetidas a políticas, términos, inicio y colecciones. Los User-Agent compartidos declaran mayoritariamente Bytespider. Esto orienta una revisión, pero no verifica por sí solo la identidad del bot ni justifica bloquear todo Amazon.

No se ha accedido directamente al panel privado ni se han publicado reglas WAF desde este trabajo. El propietario indicó que configuró protección y bloqueo geográfico; su eficacia requiere medición posterior.

1. En Usage, filtrar `zonafit` y comparar períodos completos antes/después. Separar CDN Requests, transferencias e invocaciones: servir desde CDN también cuenta una solicitud CDN.
2. Revisar rutas, IP, agentes y falsos positivos antes de aplicar bloqueos específicos. Preservar compradores, pedidos y buscadores permitidos. La exclusión de OAI-SearchBot en robots fue solicitada expresamente por el propietario.
3. Comparar el consumo real posterior. No se garantiza pasar de 826k a 50–100k; las optimizaciones no descuentan solicitudes ya consumidas.

Vercel explica que el tráfico mitigado por WAF no incurre en CDN Requests ni Fast Data Transfer: https://vercel.com/changelog/web-application-firewall-mitigated-traffic-is-free-on-vercel

Bots verificados: https://vercel.com/docs/bot-management
