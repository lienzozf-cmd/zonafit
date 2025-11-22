
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function TerminosYCondicionesPage() {
  return (
    <>
      <Header />
      <main className="bg-transparent text-white">
        <div className="container mx-auto px-4 py-12 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-accent">Términos y Condiciones</h1>
          <div className="prose prose-invert max-w-4xl mx-auto text-gray-300">
            <p className="text-lg">Última actualización: 20 de noviembre 2025</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar nuestro sitio web ZONA FIT GT (en adelante, el "Sitio"), aceptas cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no estás de acuerdo con estos términos, no debes utilizar nuestro Sitio.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">2. Uso del Sitio</h2>
            <p>
              El contenido de las páginas de este Sitio es para tu información y uso general únicamente. Está sujeto a cambios sin previo aviso. Ni nosotros ni ningún tercero ofrecemos garantía alguna en cuanto a la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales que se encuentran u ofrecen en este Sitio para un propósito particular.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">3. Productos y Precios</h2>
            <p>
              Todos los productos listados en el Sitio están sujetos a disponibilidad. Nos reservamos el derecho de limitar las cantidades de cualquier producto que ofrecemos. Todos los precios de los productos están sujetos a cambios sin previo aviso. Los precios se muestran en Quetzales (Q) y no incluyen los costos de envío, los cuales se coordinarán por separado.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">4. Proceso de Compra</h2>
            <p>
              Al realizar un pedido, te comprometes a proporcionar información de compra y de envío actual, completa y precisa. Tras confirmar tu pedido, recibirás una notificación y nos pondremos en contacto contigo para coordinar el pago y el envío.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8" id="devoluciones">5. Política de Cambios y Devoluciones</h2>
            <p className="font-bold text-accent">
              Todas las ventas realizadas a través de nuestro Sitio son finales. No se aceptan cambios ni devoluciones de ningún tipo.
            </p>
            <p>
              Te recomendamos encarecidamente que revises cuidadosamente los detalles de tu pedido, incluyendo tallas, colores y especificaciones del producto, antes de confirmar la compra. Una vez que el pedido ha sido procesado, no podremos realizar ninguna modificación. Agradecemos tu comprensión.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">6. Propiedad Intelectual</h2>
            <p>
              Este Sitio contiene material que es de nuestra propiedad o para el cual tenemos licencia. Este material incluye, pero no se limita a, el diseño, la disposición, el aspecto, la apariencia y los gráficos. La reproducción está prohibida salvo de conformidad con el aviso de derechos de autor, que forma parte de estos términos y condiciones.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">7. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso ZONA FIT GT será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la incapacidad de usar nuestro Sitio o de la compra de nuestros productos.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8">8. Cambios a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. La fecha de la última actualización se indicará al principio de esta página. Te recomendamos revisar esta página periódicamente para estar al tanto de cualquier cambio.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8">9. Contacto</h2>
            <p>
              Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos a través de nuestras redes sociales.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
