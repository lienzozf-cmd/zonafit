import HeroSection from '@/components/hero-section';
import BrandsSection from '@/components/brands-section';
import FeaturedProducts from '@/components/featured-products';
import CategoryGrid from '@/components/category-grid';
import VideoSection from '@/components/video-section';
import SocialSection from '@/components/social-section';

export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      <HeroSection />
      <BrandsSection />
      <div className="py-8 md:py-12">
        <FeaturedProducts />
      </div>
      <VideoSection />
      <CategoryGrid />
      <SocialSection />
    </div>
  );
}
