
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PoliticasDePrivacidadPage() {
  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-12 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-accent">Políticas de Privacidad</h1>
          <div className="prose prose-invert max-w-4xl mx-auto text-gray-300">
            <p className="text-lg">Última actualización: 1 de Agosto de 2024</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">1. Introducción</h2>
            <p>
              Bienvenido a ZONA FIT GT. Nos tomamos muy en serio tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando visitas nuestro sitio web. Por favor, lee esta política de privacidad cuidadosamente. Si no estás de acuerdo con los términos de esta política de privacidad, por favor no accedas al sitio.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">2. Recopilación de tu Información</h2>
            <p>
              Podemos recopilar información sobre ti de varias maneras. La información que podemos recopilar en el Sitio incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Datos Personales:</strong> Información de identificación personal, como tu nombre, dirección de envío, dirección de correo electrónico y número de teléfono, que nos proporcionas voluntariamente cuando realizas un pedido o te registras en el sitio.
              </li>
              <li>
                <strong>Datos del Pedido:</strong> Información sobre los productos que compras, los detalles del pedido y la información de envío para procesar y entregar tu compra.
              </li>
              <li>
                <strong>Datos de Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accedes al Sitio, como tu dirección IP, tu tipo de navegador, tu sistema operativo, tus tiempos de acceso y las páginas que has visto directamente antes y después de acceder al Sitio.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8">3. Uso de tu Información</h2>
            <p>
              Tener información precisa sobre ti nos permite ofrecerte una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre ti a través del Sitio para:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y gestionar tus compras, pedidos y pagos.</li>
              <li>Enviarte un correo electrónico de confirmación de pedido.</li>
              <li>Contactarte para coordinar la logística y el costo del envío.</li>
              <li>Mejorar la eficiencia y el funcionamiento del Sitio.</li>
              <li>Prevenir transacciones fraudulentas y monitorear contra el robo.</li>
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
            
            <h2 className="text-2xl font-semibold text-white mt-8">6. Contacto</h2>
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
