'use client';
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import SocialSection from '@/components/social-section';
import Header from '@/components/header';
import Footer from '@/components/footer';
import InfoSection from '@/components/info-section';
import PromoBanner from '@/components/promo-banner';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <PromoBanner />
      <main>
        <br />
        <BrandsSection />
        <br />
        <CategoryGrid />
      </main>
      <h2
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '2em',
          marginTop: '2rem',
          marginBottom: '1rem',
        }}
      >
        NUESTROS PRODUCTOS MÁS SOLICITADOS
      </h2>
      <FeaturedProducts />
      <SocialSection />
      <InfoSection />
      <Footer />
    </>
  );
}
