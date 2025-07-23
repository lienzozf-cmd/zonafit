import Link from 'next/link';
import Image from 'next/image';

const socialLinks = [
    { href: "https://www.tiktok.com/@zonafitgt_", src: "/assets/images/tiktok.png", alt: "TikTok"},
    { href: "https://www.instagram.com/zonafitgt_/", src: "/assets/images/instagram.png", alt: "Instagram"},
    { href: "https://www.facebook.com/people/Zona-Fit-Gt/pfbid02mXkKgdqTS4t2eLj6px4tNXH9L4BJtQ1DJJbsPbyguE3nN3F5hU6wSHuJ7n9p4Sfl/", src: "/assets/images/facebook.png", alt: "Facebook"},
]

const SocialSection = () => {
    return (
        <section className="bg-black py-12">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-8 animate-pulse">Síguenos en redes sociales</h2>
                <div className="flex justify-center gap-5">
                    {socialLinks.map(link => (
                        <Link href={link.href} key={link.alt} target="_blank" rel="noopener noreferrer">
                            <Image src={link.src} alt={link.alt} width={50} height={50} className="object-contain transition-transform hover:scale-125" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SocialSection;
