'use client';
import { useState, useEffect } from 'react';
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import IntroAnimation from '@/components/intro-animation';
import SocialSection from '@/components/social-section';
import VideoSection from '@/components/video-section';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (sessionStorage.getItem('introShown')) {
      setIntroFinished(true);
    }
  }, []);

  const handleIntroFinish = () => {
    setIntroFinished(true);
  };
  
  if (!isClient) {
    return null; 
  }

  return (
    <>
      <IntroAnimation onIntroFinish={handleIntroFinish} />
      {introFinished && (
        <>
          <Header />
          <HeroSection />
          <main>
            <br />
            <BrandsSection />
            <br />
            <CategoryGrid />
          </main>
          <VideoSection />
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
          <Footer />
        </>
      )}
    </>
  );
}
