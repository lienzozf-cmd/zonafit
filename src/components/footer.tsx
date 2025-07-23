import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

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

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const Footer = () => {
  return (
    <footer className="bg-secondary/50">
        <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 md:col-span-1">
            <h3 className="font-semibold mb-4 text-primary">Acerca de Nosotros</h3>
            <p className="text-sm text-muted-foreground">
                Copyright &copy; Esta página fue diseñada por "Bushido SynCode".
            </p>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4 text-primary">Contacto</h3>
            <p className="text-sm text-muted-foreground"><a href="https://www.instagram.com/zonafitgt_/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Página Web</a></p>
            <p className="text-sm text-muted-foreground">Horario: Lunes - Viernes, 9 AM - 6 PM</p>
            <div className="flex space-x-4 mt-2">
                <a href="https://www.tiktok.com/@zonafitgt_" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><TikTokIcon className="h-5 w-5"/></a>
                <a href="https://www.instagram.com/zonafitgt_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><InstagramIcon className="h-5 w-5"/></a>
            </div>
          </div>
          <div className="md:col-span-1">
                <h3 className="font-semibold mb-4 text-primary">Enlaces Útiles</h3>
                <ul className="space-y-2">
                    <li><Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">Políticas de Privacidad</Link></li>
                    <li><Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                    <li><Link href="/devoluciones" className="text-sm text-muted-foreground hover:text-primary transition-colors">No hay devoluciones</Link></li>
                </ul>
            </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>Copyright &copy; {new Date().getFullYear()} Zona Fit GT. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
