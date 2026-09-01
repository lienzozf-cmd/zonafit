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

const brandMenuColors: { [key: string]: { text: string; bgHover: string; glow: string; border: string; badgeBg: string } } = {
  'YoungLA': {
    text: '#EF4444',
    bgHover: 'rgba(239, 68, 68, 0.18)',
    glow: 'rgba(239, 68, 68, 0.6)',
    border: 'rgba(239, 68, 68, 0.5)',
    badgeBg: '#DC2626'
  },
  'Gymshark': {
    text: '#38BDF8', // Celeste
    bgHover: 'rgba(56, 189, 248, 0.18)',
    glow: 'rgba(56, 189, 248, 0.6)',
    border: 'rgba(56, 189, 248, 0.5)',
    badgeBg: '#0284C7'
  },
  'Darc Sport': {
    text: '#FB923C',
    bgHover: 'rgba(251, 146, 60, 0.18)',
    glow: 'rgba(251, 146, 60, 0.6)',
    border: 'rgba(251, 146, 60, 0.5)',
    badgeBg: '#EA580C'
  },
  'Vanquish': {
    text: '#38BDF8',
    bgHover: 'rgba(14, 165, 233, 0.18)',
    glow: 'rgba(14, 165, 233, 0.6)',
    border: 'rgba(14, 165, 233, 0.5)',
    badgeBg: '#0EA5E9'
  },
  'Dfyne': {
    text: '#C084FC',
    bgHover: 'rgba(192, 132, 252, 0.18)',
    glow: 'rgba(192, 132, 252, 0.6)',
    border: 'rgba(192, 132, 252, 0.5)',
    badgeBg: '#9333EA'
  },
  'Dragon Pharma': {
    text: '#F43F5E',
    bgHover: 'rgba(244, 63, 94, 0.18)',
    glow: 'rgba(244, 63, 94, 0.6)',
    border: 'rgba(244, 63, 94, 0.5)',
    badgeBg: '#E11D48'
  },
  'RAW': {
    text: '#4ADE80',
    bgHover: 'rgba(74, 222, 128, 0.18)',
    glow: 'rgba(74, 222, 128, 0.6)',
    border: 'rgba(74, 222, 128, 0.5)',
    badgeBg: '#16A34A'
  },
  'RGMNT': {
    text: '#FBBF24',
    bgHover: 'rgba(251, 191, 36, 0.18)',
    glow: 'rgba(251, 191, 36, 0.6)',
    border: 'rgba(251, 191, 36, 0.5)',
    badgeBg: '#D97706'
  },
  'Bum Energy': {
    text: '#FACC15',
    bgHover: 'rgba(250, 204, 21, 0.18)',
    glow: 'rgba(250, 204, 21, 0.6)',
    border: 'rgba(250, 204, 21, 0.5)',
    badgeBg: '#CA8A04'
  },
  'Civil Regime': {
    text: '#F472B6', // Rosa fucsia / magenta
    bgHover: 'rgba(244, 114, 182, 0.18)',
    glow: 'rgba(244, 114, 182, 0.6)',
    border: 'rgba(244, 114, 182, 0.5)',
    badgeBg: '#DB2777'
  }
};

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
          {navLinks.map((link) => {
            const isMarcas = link.title.toUpperCase() === 'MARCAS';
            return (
              <li key={link.title} className="group/nav">
                <Link href={link.href} className="nav-main-link">
                  <span>{link.title}</span>
                  {link.sublinks && link.sublinks.length > 0 && (
                    <span className="dropdown-arrow text-[10px] ml-1.5 opacity-70 group-hover/nav:text-red-500 group-hover/nav:translate-y-0.5 transition-all">▼</span>
                  )}
                </Link>
                {link.sublinks && (
                  <ul className="dropdown-menu">
                    {link.sublinks.map((sublink) => {
                      const hasChildren = sublink.sublinks && sublink.sublinks.length > 0;
                      const isVerTodo = sublink.title.toLowerCase() === 'ver todo';
                      const brandCfg = isMarcas ? brandMenuColors[sublink.title] : null;

                      return (
                        <li key={sublink.title} className="group/sub">
                          <Link
                            href={sublink.href}
                            className={`dropdown-link flex items-center justify-between gap-3 ${
                              isVerTodo ? 'font-black text-red-500 hover:text-white border-t border-zinc-800/80 mt-1 pt-2' : ''
                            }`}
                            style={brandCfg ? {
                              ['--brand-hover-color' as any]: brandCfg.text,
                              ['--brand-hover-bg' as any]: brandCfg.bgHover,
                            } : undefined}
                          >
                            <span className="flex items-center gap-2">
                              {isVerTodo && <span className="text-red-500 font-black">★</span>}
                              {brandCfg && (
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-200 group-hover/sub:scale-125"
                                  style={{
                                    backgroundColor: brandCfg.text,
                                    boxShadow: `0 0 8px ${brandCfg.glow}`
                                  }}
                                />
                              )}
                              <span
                                className="transition-colors duration-200"
                                style={brandCfg ? {
                                  color: '#F3F4F6'
                                } : undefined}
                              >
                                {sublink.title}
                              </span>
                            </span>

                            {brandCfg && (
                              <span
                                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded transition-all border"
                                style={{
                                  backgroundColor: brandCfg.bgHover,
                                  color: brandCfg.text,
                                  borderColor: brandCfg.border,
                                  boxShadow: `0 0 10px ${brandCfg.glow}`
                                }}
                              >
                                {sublink.title === 'Gymshark' ? 'GYMSHARK' : sublink.title.toUpperCase()}
                              </span>
                            )}

                            {hasChildren && (
                              <span className="dropdown-arrow-sub text-[9px] text-zinc-500 group-hover/sub:text-red-400 group-hover/sub:translate-x-0.5 transition-all">
                                ►
                              </span>
                            )}
                          </Link>
                          {hasChildren && (
                            <ul className="sub-submenu">
                              <li className="px-3 py-1.5 text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-zinc-800/60 mb-1">
                                {sublink.title}
                              </li>
                              {sublink.sublinks!.map((item) => (
                                <li key={item.title}>
                                  <Link href={item.href} className="sub-dropdown-link">
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
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
      <Cart />
    </>
  );
};

export default Header;