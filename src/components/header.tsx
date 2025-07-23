'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Menu,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { cn } from '@/lib/utils';
import { navLinks, products } from '@/lib/data';
import React, { useState } from 'react';
import Image from 'next/image';

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);

  const performSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };

  return (
    <header className="site-header">
      <div className="header-top">
          <div className="site-branding">
            <Link href="/">
              <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" width={80} height={80} id="site-logo" />
            </Link>
          </div>
          <div className="header-icons">
              <div className="search-container">
                  <Image src="/assets/icons/search-icon.svg" alt="Search Icon" width={24} height={24} className="search-icon" onClick={() => setIsSearchActive(!isSearchActive)} />
                  {isSearchActive && (
                    <div className="search-box active" id="searchBox">
                        <input 
                          type="text" 
                          id="searchInput" 
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                        />
                        <button id="searchButton" onClick={performSearch}>Buscar</button>
                    </div>
                  )}
                  {searchResults.length > 0 && isSearchActive && (
                     <div id="searchResults" className="active">
                       {searchResults.map(result => (
                         <div key={result.id} className="search-result-item">
                           <Image src={result.images[0].src} alt={result.name} width={50} height={50} />
                           <div className="search-result-info">
                             <div className="search-result-name">{result.name}</div>
                             <div className="search-result-price">{result.price}</div>
                           </div>
                         </div>
                       ))}
                     </div>
                  )}
              </div>
              <Image src="/assets/icons/cart-icon.svg" alt="Cart Icon" width={24} height={24} className="cart-icon" />
              <div className="md:hidden">
                <MobileNav />
              </div>
          </div>
      </div>
      <DesktopNav />
    </header>
  );
};

const DesktopNav = () => (
    <nav className="site-navigation hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.title} className="has-dropdown">
              <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
              <NavigationMenuContent className="dropdown-menu">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {link.sublinks.map((sublink) => (
                     <li key={sublink.title} className={sublink.sublinks && sublink.sublinks.length > 0 ? 'has-sub-submenu' : ''}>
                        <ListItem
                          title={sublink.title}
                          href={sublink.href}
                        >
                          {sublink.sublinks && sublink.sublinks.length > 0 && (
                            <ul className="sub-submenu">
                              {sublink.sublinks.map(s => (
                                <li key={s.title}><Link href={s.href}>{s.title}</Link></li>
                              ))}
                            </ul>
                          )}
                        </ListItem>
                     </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
);

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="text-white hover:text-red-500">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir Menú</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="bg-black text-white border-r-red-500/50">
      <div className="p-4">
        <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
            <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" width={60} height={60} />
            <span className="font-bold font-headline text-lg">
              ZONA FIT GT
            </span>
          </Link>
        <Accordion type="single" collapsible className="w-full">
          {navLinks.map((link) => (
            <AccordionItem value={link.title} key={link.title} className="border-b-gray-700">
              <AccordionTrigger className="hover:text-red-500">{link.title}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-4">
                  {link.sublinks.map((sublink) =>
                    sublink.sublinks && sublink.sublinks.length > 0 ? (
                       <Accordion type="single" collapsible key={sublink.title}>
                         <AccordionItem value={sublink.title} className="border-b-0">
                           <AccordionTrigger className="py-2 text-sm hover:text-red-500">{sublink.title}</AccordionTrigger>
                           <AccordionContent>
                              <div className="flex flex-col space-y-2 pl-4">
                                {sublink.sublinks.map((s) => (
                                    <SheetClose asChild key={s.title}>
                                      <Link href={s.href} className="text-gray-400 hover:text-red-500 py-1">{s.title}</Link>
                                    </SheetClose>
                                ))}
                              </div>
                           </AccordionContent>
                         </AccordionItem>
                       </Accordion>
                    ) : (
                      <SheetClose asChild key={sublink.title}>
                        <Link href={sublink.href} className="py-1 hover:text-red-500">{sublink.title}</Link>
                      </SheetClose>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SheetContent>
  </Sheet>
);

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none text-white hover:text-red-500">{title}</div>
        {children && (
           <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
             {children}
           </div>
        )}
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = 'ListItem';


export default Header;
