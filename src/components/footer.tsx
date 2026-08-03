import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Acerca de Nosotros</h3>
          <p>Copyright © Zona Fit Gt</p>
          <p>
            Esta página fue diseñada por ©{" "}
            <a
              href="https://lienzoblanco.online"
              target="_blank"
              rel="noopener noreferrer"
              className="lienzo-blanco-link"
            >
              "Lienzo Blanco"
            </a>
            .
          </p>
        </div>
        <div className="footer-section contact">
          <h3>Horarios</h3>
          <p>Lunes - Domingo, 8 AM - 8 PM</p>
          <div className="socials">
            <a href="https://www.instagram.com/lienzo_blanco_gt" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/images/redesociales/instagram.png" alt="Instagram" width={30} height={30} data-ai-hint="instagram icon" />
            </a>
          </div>
        </div>
        <div className="footer-section links">
          <h3>Enlaces Útiles</h3>
          <ul>
            <li><Link href="/politicas-de-privacidad">Políticas de Privacidad</Link></li>
            <li><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
            <li><Link href="/terminos-y-condiciones#devoluciones"><strong className="uppercase">POLÍTICA DE DEVOLUCIONES</strong></Link></li>
            <li>
                <Link href="/admin" aria-label="Admin Panel" style={{ color: '#000000' }}>
                  <Lock className="h-4 w-4" />
                </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
