import Link from 'next/link';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 7.25a6.5 6.5 0 1 0-7.75 6.47v2.53a1.75 1.75 0 1 0 3.5 0v-5a3.25 3.25 0 0 1-3.25-3.25h-1.5a1.75 1.75 0 0 0-1.75 1.75v8.5a1.75 1.75 0 1 0 3.5 0v-2.53a6.5 6.5 0 0 0 7.25-6.47Z"/>
    </svg>
  );
  
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white">
        <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-4">
            <h3 className="font-semibold mb-4 text-yellow-500">Acerca de Nosotros</h3>
            <p className="text-gray-400">
                Copyright &copy; Esta página fue diseñada por "Bushido SynCode".
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-yellow-500">Contacto</h3>
            <p><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Página Web</a></p>
            <p className="text-gray-400">Horario: Lunes - Viernes, 9 AM - 6 PM</p>
            <div className="flex space-x-4 mt-2">
                <a href="https://www.tiktok.com/@zonafitgt_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors"><TikTokIcon className="h-5 w-5"/></a>
                <a href="https://www.instagram.com/zonafitgt_/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors"><InstagramIcon className="h-5 w-5"/></a>
            </div>
          </div>
          <div>
                <h3 className="font-semibold mb-4 text-yellow-500">Enlaces Útiles</h3>
                <ul className="space-y-2">
                    <li><Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">Políticas de Privacidad</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">Términos y Condiciones</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">No hay devoluciones</Link></li>
                </ul>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
