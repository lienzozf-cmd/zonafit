import Image from 'next/image';

const socialLinks = [
    { href: "https://www.tiktok.com/@zonafitgt_", src: "/assets/images/redesociales/tiktok.png", alt: "TikTok", dataAiHint: "tiktok icon"},
    { href: "https://www.instagram.com/zonafitgt_/", src: "/assets/images/redesociales/instagram.png", alt: "Instagram", dataAiHint: "instagram icon"},
    { href: "https://www.facebook.com/people/Zona-Fit-Gt/pfbid02mXkKgdqTS4t2eLj6px4tNXH9L4BJtQ1DJJbsPbyguE3nN3F5hU6wSHuJ7n9p4Sfl/", src: "/assets/images/redesociales/facebook.png", alt: "Facebook", dataAiHint: "facebook icon"},
]

const SocialSection = () => {
    return (
        <section className="social-media">
            <h2 className="social-media-heading-animated">Síguenos en redes sociales</h2>
            <div className="social-icons">
                {socialLinks.map(link => (
                    <a href={link.href} key={link.alt} target="_blank" rel="noopener noreferrer">
                        <Image src={link.src} alt={link.alt} width={50} height={50} data-ai-hint={link.dataAiHint}/>
                    </a>
                ))}
            </div>
        </section>
    )
}

export default SocialSection;
