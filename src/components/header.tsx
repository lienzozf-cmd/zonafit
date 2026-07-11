'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '@/lib/data';
import type { Product } from '@/lib/data';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import Cart from './cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/placeholder/200/200';

const Header = () => {
  const products = useCartStore((state) => state.products);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const itemCount = useCartStore((state) => state.itemCount);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const isMobile = useIsMobile();
  const router = useRouter();

  const performSearch = (term: string) => {
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = products.filter(p => p.visible !== false && p.name.toLowerCase().includes(term.toLowerCase()));
    setSearchResults(results);
  };
  
  const handleSearchResultClick = (product: Product) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/product/${product.id}`);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    performSearch(term);
  };

  const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        router.push(href);
    }
    if (isMobile) {
      return (
        <Accordion type="multiple" className="w-full">
          {navLinks.map((link) =>
            link.sublinks ? (
              <AccordionItem value={link.title} key={link.title} className="border-gray-700">
                <AccordionTrigger className="text-white hover:no-underline">
                  <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>{link.title}</a>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4">
                    {link.sublinks.map((sublink) => (
                      <li key={sublink.title} className="py-2">
                        {sublink.sublinks ? (
                           <Accordion type="multiple" className="w-full">
                             <AccordionItem value={sublink.title} className="border-gray-700">
                               <AccordionTrigger className="text-white hover:no-underline">
                                <a href={sublink.href} onClick={(e) => handleLinkClick(e, sublink.href)}>{sublink.title}</a>
                               </AccordionTrigger>
                               <AccordionContent>
                                <ul className="pl-4">
                                  {sublink.sublinks.map((item) => (
                                    <li key={item.title} className="py-2">
                                      <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="text-gray-300 hover:text-white">{item.title}</a>
                                    </li>
                                  ))}
                                </ul>
                               </AccordionContent>
                             </AccordionItem>
                           </Accordion>
                        ) : (
                          <a href={sublink.href} onClick={(e) => handleLinkClick(e, sublink.href)} className="text-gray-300 hover:text-white">{sublink.title}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <a key={link.title} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="block py-4 text-white border-b border-gray-700">{link.title}</a>
            )
          )}
        </Accordion>
      );
    }

    return (
      <nav className="site-navigation">
        <ul>
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link href={link.href}>
                {link.title} {link.sublinks && <span className="dropdown-arrow">▼</span>}
              </Link>
              {link.sublinks && (
                <ul className="dropdown-menu">
                  {link.sublinks.map((sublink) => (
                    <li key={sublink.title}>
                      <Link href={sublink.href}>
                        {sublink.title} {link.sublinks && <span className="dropdown-arrow">►</span>}
                      </Link>
                      {sublink.sublinks && (
                        <ul className="sub-submenu">
                          {sublink.sublinks.map((item) => (
                            <li key={item.title}>
                              <Link href={item.href}>{item.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  const MobileMenu = () => (
     <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
            <button className="mobile-menu-button">
            <Menu className="cart-icon" />
            </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-black text-white w-full max-w-sm overflow-y-auto p-0">
            <SheetHeader className="p-6 pb-2 border-b border-gray-700 flex flex-row items-center justify-between">
            <SheetTitle className='text-white'>Menú</SheetTitle>
            </SheetHeader>
            <div className="px-6 pt-6 pb-6">
            {renderNavLinks(true)}
            </div>
        </SheetContent>
    </Sheet>
  );

  return (
    <>
      <header className="site-header">
        {isMobile ? <MobileMenu /> : (
          <>
            <div className="site-branding">
              <Link href="/">
                <Image src="/assets/images/logos/logo.webp" alt="Zona Fit Logo" id="site-logo" width={150} height={37} data-ai-hint="logo" />
              </Link>
            </div>
            {renderNavLinks(false)}
          </>
        )}
        
        {isMobile && (
             <div className="site-branding">
              <Link href="/">
                <Image src="/assets/images/logos/logo.webp" alt="Zona Fit Logo" id="site-logo" width={150} height={37} data-ai-hint="logo" />
              </Link>
            </div>
        )}

        <div className="header-icons">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <button onClick={() => setIsSearchOpen(true)} aria-label="Open search">
              <Search
                className="search-icon"
                color="hsl(var(--accent))"
              />
            </button>
            <DialogContent className="search-dialog-content">
                <DialogTitle className="sr-only">Búsqueda de productos</DialogTitle>
                <div className="search-dialog-header">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Busca un producto o marca..."
                        className="search-dialog-input"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="search-results-container">
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => {
                      const resultImg = result.images && result.images.length > 0 ? result.images[0].src : PLACEHOLDER_IMAGE;
                      return (
                        <div key={`${result.id}-${index}`} className="search-result-item" onClick={() => handleSearchResultClick(result)}>
                            <Image src={resultImg} alt={result.name} width={50} height={50} unoptimized />
                            <div className="search-result-info">
                            <div className="search-result-name">{result.name}</div>
                            <div className="search-result-price">{result.price}</div>
                            </div>
                        </div>
                      );
                    })
                ) : (
                    searchTerm && <div className="no-results">No se encontraron resultados.</div>
                )}
                </div>
            </DialogContent>
        </Dialog>

          <div className="relative">
            <ShoppingCart className="cart-icon" color="hsl(var(--accent))" onClick={() => setIsCartOpen(true)}/>
            {itemCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </div>
      </header>
      <div className="promo-banner-fixed">
        ⚡ 10% DE DESCUENTO EN TODA LA TIENDA ⚡
      </div>
      <Cart />
    </>
  );
};

export default Header;