'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '@/lib/data';
import type { Product } from '@/lib/data';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import Cart from './cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';

const Header = () => {
  const { products, setIsCartOpen } = useCart();
  const itemCount = useCart(state => state.itemCount);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const router = useRouter();

  const performSearch = (term: string) => {
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = products.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
    setSearchResults(results);
    setIsSearchActive(true);
  };
  
  const handleSearchResultClick = (product: Product) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsMobileMenuOpen(false);
    router.push(`/product/${product.id}`);
  };

  const renderNavLinks = (isMobile = false) => {
    if (isMobile) {
      return (
        <Accordion type="multiple" className="w-full">
          {navLinks.map((link) =>
            link.sublinks ? (
              <AccordionItem value={link.title} key={link.title} className="border-gray-700">
                <AccordionTrigger className="text-white hover:no-underline">
                  {link.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4">
                    {link.sublinks.map((sublink) => (
                      <li key={sublink.title} className="py-2">
                        {sublink.sublinks ? (
                           <Accordion type="multiple" className="w-full">
                             <AccordionItem value={sublink.title} className="border-gray-700">
                               <AccordionTrigger className="text-white hover:no-underline">
                                 {sublink.title}
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
    const searchComponent = (
      <div className={`search-container ${isMobile ? 'mobile-search' : ''}`} ref={searchContainerRef}>
        {(isMobile === false) && (
          <Search
            className="search-icon"
            onClick={() => setIsSearchActive(!isSearchActive)}
            color="hsl(var(--accent))"
          />
        )}
        <div className={`search-box ${isMobile || isSearchActive ? 'active' : ''}`}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => {
              const term = e.target.value;
              setSearchTerm(term);
              performSearch(term);
            }}
            onFocus={() => setIsSearchActive(true)}
          />
           <button 
            onClick={() => performSearch(searchTerm)}
            className={`${isMobile ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Buscar
          </button>
        </div>
        <div id="searchResults" className={isSearchActive && searchTerm ? 'active' : ''}>
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
            (isSearchActive && searchTerm) && <div className="search-result-item">No se encontraron productos</div>
          )}
        </div>
      </div>
    );

    if (isMobile) {
       return (
        <div className="p-4">
            <div className="p-1">{searchComponent}</div>
        </div>
      );
    }
    return searchComponent;
  }

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
            <div>
              {renderSearch(true)}
            </div>
            <div className="px-6 pt-0 pb-6">
            {renderNavLinks(true)}
            </div>
        </SheetContent>
    </Sheet>
  );

  return (
    <>
      <header className="site-header">
        {isMobile ? (
          <>
            <MobileMenu />
            <div className="site-branding">
              <Link href="/">
                <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" id="site-logo" width={150} height={80} data-ai-hint="logo" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="site-branding">
              <Link href="/">
                <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" id="site-logo" width={150} height={80} data-ai-hint="logo" />
              </Link>
            </div>
            {renderNavLinks(false)}
          </>
        )}
        <div className="header-icons">
          {isMobile ? (
            <Search
                className="search-icon"
                onClick={() => setIsMobileMenuOpen(true)}
                color="hsl(var(--accent))"
            />
          ) : renderSearch(false)}
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
      <Cart />
    </>
  );
};

export default Header;
