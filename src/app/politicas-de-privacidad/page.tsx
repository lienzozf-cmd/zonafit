
import Header from '@/components/header';
import Footer from '@/components/footer';
import ResetCookieButton from '@/components/reset-cookie-button';

export default function PoliticasDePrivacidadPage() {
  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-12 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-accent">Políticas de Privacidad</h1>
          <div className="prose prose-invert max-w-4xl mx-auto text-gray-300">
            <p className="text-lg">Última actualización: 20 de noviembre 2025</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">1. Introducción</h2>
            <p>
              Bienvenido a ZONA FIT GT. Nos tomamos muy en serio tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando visitas nuestro sitio web. Por favor, lee esta política de privacidad cuidadosamente. Si no estás de acuerdo con los términos de esta política de privacidad, por favor no accedas al sitio.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">2. Recopilación de tu Información</h2>
            <p>
              Recopilamos información únicamente necesaria para procesar tus compras y mejorar tu experiencia de navegación. La información recopilada incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Datos Personales y de Contacto:</strong> Información que nos proporcionas directamente durante el proceso de compra (checkout) como tu nombre, apellido, dirección de correo electrónico, número de teléfono y dirección completa de entrega (incluyendo municipio y departamento).
              </li>
              <li>
                <strong>Datos de la Transacción:</strong> Detalles de los productos adquiridos, método de pago seleccionado, desglose de costos de envío y comisiones correspondientes.
              </li>
              <li>
                <strong>Datos de Navegación y Rastreo (Cookies):</strong> Información recopilada automáticamente para análisis estadístico y de marketing (Google Ads y Microsoft Clarity) como tu dirección IP, tipo de navegador, sistema operativo, páginas visitadas y comportamiento de interacción en nuestro sitio. Esta recopilación requiere tu consentimiento previo a través de nuestro aviso de cookies.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">3. Tratamiento y Uso de tu Información</h2>
            <p>
              Tus datos son tratados bajo principios de licitud y confidencialidad. Específicamente, utilizamos tus datos para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar, preparar y facturar tus pedidos.</li>
              <li>Coordinar de forma precisa la entrega física de tus productos y los costos de envío.</li>
              <li>Enviar notificaciones operativas (como confirmaciones de pedido) por correo electrónico.</li>
              <li>Recibir notificaciones inmediatas a nuestro canal interno de servicio al cliente (Telegram) para acelerar el procesamiento.</li>
              <li>Garantizar la seguridad de la tienda, detectando y previniendo fraudes o ataques malintencionados.</li>
              <li>Optimizar el rendimiento y diseño de la tienda a través de estadísticas de comportamiento, únicamente si has aceptado nuestras cookies de análisis.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">4. Divulgación de tu Información</h2>
            <p>
              No compartiremos, venderemos, alquilaremos ni intercambiaremos tu información con terceros para fines promocionales. Podemos compartir información sobre ti en ciertas situaciones, como:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Por Ley o para Proteger Derechos:</strong> Si creemos que la divulgación de información sobre ti es necesaria para responder a un proceso legal, para investigar o remediar posibles violaciones de nuestras políticas, o para proteger los derechos, la propiedad y la seguridad de otros.
              </li>
              <li>
                <strong>Proveedores de Servicios:</strong> Podemos compartir tu información con terceros que realizan servicios para nosotros o en nuestro nombre, incluido el procesamiento de pagos (si aplica) y la entrega de pedidos.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">5. Seguridad de tu Información</h2>
            <p>
              Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger tu información personal. Si bien hemos tomado medidas razonables para proteger la información personal que nos proporcionas, ten en cuenta que a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y no se puede garantizar ningún método de transmisión de datos contra cualquier intercepción u otro tipo de uso indebido.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">6. Configuración y Consentimiento</h2>
            <p>
              Puedes revisar, cambiar o restablecer tu configuración de consentimiento de cookies en cualquier momento utilizando el siguiente control:
            </p>
            <ResetCookieButton />
            
            <h2 className="text-2xl font-semibold text-white mt-8">7. Contacto</h2>
            <p>
              Si tienes preguntas o comentarios sobre esta Política de Privacidad, por favor contáctanos a través de nuestras redes sociales.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
