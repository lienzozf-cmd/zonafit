import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Acerca de Nosotros</h3>
          <p>Copyright &copy; Esta página fue diseñada por "Bushido SynCode".</p>
        </div>
        <div className="footer-section contact">
          <h3>Contacto</h3>
          <p><a href="#">Página Web</a></p>
          <p>Horario: Lunes - Viernes, 9 AM - 6 PM</p>
          <div className="socials">
            <a href="https://www.instagram.com/zonafitgt_/" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/images/redesociales/instagram.png" alt="Instagram" width={30} height={30} data-ai-hint="instagram icon" />
            </a>
            <a href="https://www.tiktok.com/@zonafitgt_" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/images/redesociales/tiktok.png" alt="TikTok" width={30} height={30} data-ai-hint="tiktok icon" />
            </a>
          </div>
        </div>
        <div className="footer-section links">
          <h3>Enlaces Útiles</h3>
          <ul>
            <li><Link href="#">Políticas de Privacidad</Link></li>
            <li><Link href="#">Términos y Condiciones</Link></li>
            <li><Link href="#">No hay devoluciones</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
