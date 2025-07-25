import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import IntroAnimation from '@/components/intro-animation';
import SocialSection from '@/components/social-section';
import VideoSection from '@/components/video-section';

export default function Home() {
  return (
    <>
      <IntroAnimation />
      <Header />
      <HeroSection />
      <main>
        <br />
        <BrandsSection />
        <br />
        <h2
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '2em',
          }}
        >
          NUESTROS PRODUCTOS MÁS SOLICITADOS
        </h2>
        <FeaturedProducts />
      </main>
      <VideoSection />
      <CategoryGrid />
      <SocialSection />
      <Footer />
    </>
  );
}
