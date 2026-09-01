
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import Header from '@/components/header';
import Footer from '@/components/footer';
import InfoSection from '@/components/info-section';
import SizeFinder from '@/components/size-finder';

export default function Home() {
  return (
    <div className="bg-transparent">
      <Header />
      <HeroSection />
      <main>
        <br />
        <div>
          <BrandsSection />
        </div>
        <br />
      </main>
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
      <Footer />
    </div>
  );
}
