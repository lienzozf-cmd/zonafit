'use client';
import { Flame } from 'lucide-react';

const PromoBanner = () => {
  const content = (
    <span className="flex items-center gap-2">
      <Flame className="h-6 w-6" />
      ofertas por el black fit
    </span>
  );

  return (
    <div className="promo-banner">
      <div className="promo-banner-content">
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
      </div>
      <div className="promo-banner-content" aria-hidden="true">
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

export default PromoBanner;
