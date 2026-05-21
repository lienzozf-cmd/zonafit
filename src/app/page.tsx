
import BrandsSection from '@/components/brands-section';
import CategoryGrid from '@/components/category-grid';
import FeaturedProducts from '@/components/featured-products';
import HeroSection from '@/components/hero-section';
import Header from '@/components/header';
import Footer from '@/components/footer';
import InfoSection from '@/components/info-section';

export default function Home() {
  return (
    <div className="bg-black">
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
        <InfoSection />
      </div>
      <Footer />
    </div>
  );
}
