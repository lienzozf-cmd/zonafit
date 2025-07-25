'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, navLinks } from '@/lib/data';
import type { Product } from '@/lib/data';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Cart from './cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const Header = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const performSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchResultClick = (product: Product) => {
    setIsSearchActive(false);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
    const element = document.getElementById(`product-item-${product.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }
  };

  const renderNavLinks = (isMobile = false) => {
    if (isMobile) {
      return (
        <Accordion type="multiple" className="w-full">
          {navLinks.map((link) =>
            link.sublinks ? (
              <AccordionItem value={link.title} key={link.title}>
                <AccordionTrigger className="text-white hover:no-underline">
                  <a href={link.href} onClick={() => setIsMobileMenuOpen(false)}>{link.title}</a>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4">
                    {link.sublinks.map((sublink) => (
                      <li key={sublink.title} className="py-2">
                        {sublink.sublinks ? (
                           <Accordion type="multiple" className="w-full">
                             <AccordionItem value={sublink.title}>
                               <AccordionTrigger className="text-white hover:no-underline">
                                 <a href={sublink.href} onClick={() => setIsMobileMenuOpen(false)}>{sublink.title}</a>
                               </AccordionTrigger>
                               <AccordionContent>
                                <ul className="pl-4">
                                  {sublink.sublinks.map((item) => (
                                    <li key={item.title} className="py-2">
                                      <a href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">{item.title}</a>
                                    </li>
                                  ))}
                                </ul>
                               </AccordionContent>
                             </AccordionItem>
                           </Accordion>
                        ) : (
                          <a href={sublink.href} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">{sublink.title}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <a key={link.title} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-white border-b border-gray-700">{link.title}</a>
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
              <a href={link.href}>
                {link.title} {link.sublinks && <span className="dropdown-arrow">▼</span>}
              </a>
              {link.sublinks && (
                <ul className="dropdown-menu">
                  {link.sublinks.map((sublink) => (
                    <li key={sublink.title}>
                      <a href={sublink.href}>
                        {sublink.title} {sublink.sublinks && <span className="dropdown-arrow">►</span>}
                      </a>
                      {sublink.sublinks && (
                        <ul className="sub-submenu">
                          {sublink.sublinks.map((item) => (
                            <li key={item.title}>
                              <a href={item.href}>{item.title}</a>
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
  
  const renderSearch = (isMobile = false) => {
    return (
       <div className={`search-container ${isMobile ? 'mobile-search' : ''}`} ref={searchContainerRef}>
        {!isMobile && (
          <Search
            className="search-icon"
            onClick={() => setIsSearchActive(!isSearchActive)}
          />
        )}
        <div className={`search-box ${isSearchActive || isMobile ? 'active' : ''}`}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && performSearch()}
          />
          <button onClick={performSearch}>Buscar</button>
        </div>
        <div id="searchResults" className={isSearchActive || isMobile ? 'active' : ''}>
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <div key={result.id} className="search-result-item" onClick={() => handleSearchResultClick(result)}>
                <Image src={result.images[0].src} alt={result.name} width={50} height={50} data-ai-hint={result.images[0].dataAiHint} />
                <div className="search-result-info">
                  <div className="search-result-name">{result.name}</div>
                  <div className="search-result-price">{result.price}</div>
                </div>
              </div>
            ))
          ) : (
            ((isSearchActive || isMobile) && searchTerm) && <div className="search-result-item">No se encontraron productos</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="site-header">
        <div className="site-branding">
          <Link href="/">
            <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" id="site-logo" width={150} height={80} data-ai-hint="logo" />
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
               <button className="mobile-menu-button">
                <Menu className="cart-icon" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black text-white w-full max-w-sm overflow-y-auto">
               <SheetHeader>
                <SheetTitle className='text-white'>Menú</SheetTitle>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4">
                  <X className="text-white" />
                </button>
              </SheetHeader>
              <div className="mt-4 p-4">
                {renderSearch(true)}
              </div>
              <div className="mt-4">
                {renderNavLinks(true)}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          renderNavLinks(false)
        )}

        <div className="header-icons">
         {!isMobile && renderSearch(false)}
          <div className="relative">
            <ShoppingCart className="cart-icon" onClick={() => setIsCartOpen(true)}/>
            {itemCount > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </div>
      </header>
      <Cart />
    </>
  );
};

export default Header;
