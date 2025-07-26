'use client';
import { useState } from 'react';
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import IntroAnimation from '@/components/intro-animation';
import SocialSection from '@/components/social-section';
import VideoSection from '@/components/video-section';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroFinish = () => {
    setIntroFinished(true);
  };

  return (
    <>
      <IntroAnimation onIntroFinish={handleIntroFinish} />
      {introFinished && (
        <>
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
        </>
      )}
    </>
  );
}
