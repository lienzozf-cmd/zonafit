import HeroSection from '@/components/hero-section';
import BrandsSection from '@/components/brands-section';
import FeaturedProducts from '@/components/featured-products';
import CategoryGrid from '@/components/category-grid';
import VideoSection from '@/components/video-section';
import SocialSection from '@/components/social-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <main>
        <br />
        <BrandsSection />
        <br />
        <h2 style={{ color: 'white', textAlign: 'center' }}>NUESTROS PRODUCTOS MÁS SOLICITADOS</h2>
        <FeaturedProducts />
      </main>
      <VideoSection />
      <CategoryGrid />
      <SocialSection />
    </>
  );
}
