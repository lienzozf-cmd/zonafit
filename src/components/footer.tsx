import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Acerca de Nosotros</h3>
          <p>Copyright © Zona Fit Gt</p>
          <p>Esta página fue diseñada por © "Lienzo Blanco".</p>
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
            <li><Link href="/terminos-y-condiciones#devoluciones"><strong className="uppercase">NO HAY CAMBIO NI DEVOLUCIONES</strong></Link></li>
            <li><Link href="/admin" style={{fontSize: '2px', color: 'transparent'}}>.</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
