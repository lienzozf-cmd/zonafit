import HeroSection from '@/components/hero-section';
import BrandsSection from '@/components/brands-section';
import FeaturedProducts from '@/components/featured-products';
import CategoryGrid from '@/components/category-grid';
import { Separator } from '@/components/ui/separator';
import VideoSection from '@/components/video-section';
import SocialSection from '@/components/social-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BrandsSection />
      <div className="py-8 md:py-12">
        <FeaturedProducts />
      </div>
      <Separator />
      <div className="py-8 md:py-12">
        <VideoSection />
      </div>
      <CategoryGrid />
      <SocialSection />
    </div>
  );
}
