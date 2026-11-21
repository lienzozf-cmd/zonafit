
import HomeDiscovery from '@/components/seo/home-discovery';
import type { Metadata } from 'next';
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import Header from '@/components/header';
import Footer from '@/components/footer';
import InfoSection from '@/components/info-section';
import SizeFinder from '@/components/size-finder';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <div className="bg-transparent">
      <Header />
      <main>
        <div className="container mx-auto max-w-6xl px-5 pt-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-black text-white">Ropa de gym en Guatemala — ZonaFitGT</h1>
          <p className="mt-3 text-base text-zinc-300">YoungLA, Gymshark, DFYNE, compresión, oversize y ropa de anime para entrenar.</p>
        </div>
        <HeroSection />
        <br />
        <div>
          <BrandsSection />
        </div>
        <br />
      <FeaturedProducts />
      <div>
        <CategoryGrid />
      </div>

      <div>
        <SizeFinder />
      </div>

      <div>
        <InfoSection />
      </div>
      <HomeDiscovery />
      </main>
      <Footer />
    </div>
  );
}
