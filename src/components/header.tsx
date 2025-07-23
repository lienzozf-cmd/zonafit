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
import { navLinks } from '@/lib/data';
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-500/20 bg-black">
      <div className="container flex flex-col items-center py-2">
        <div className="w-full flex justify-between items-center mb-2">
            <div className="flex-1">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" width={80} height={80} id="site-logo" />
                </Link>
            </div>
            <div className="flex-1 flex justify-center md:hidden">
                {/* Placeholder for mobile logo or title if needed */}
            </div>
            <div className="flex-1 flex justify-end items-center space-x-2">
                <div className="hidden sm:block relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar productos..." className="pl-10 bg-gray-900 border-gray-700 text-white" />
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:text-red-500">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Carrito de compras</span>
                </Button>
                <div className="md:hidden">
                    <MobileNav />
                </div>
            </div>
        </div>
        <div className="w-full hidden md:flex justify-center">
            <DesktopNav />
        </div>
      </div>
    </header>
  );
};

const DesktopNav = () => (
  <NavigationMenu>
    <NavigationMenuList>
      {navLinks.map((link) => (
        <NavigationMenuItem key={link.title}>
          <NavigationMenuTrigger className="text-white hover:text-red-500 bg-transparent hover:bg-gray-900">{link.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-black border-red-500 text-white">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {link.sublinks.map((sublink) => (
                <ListItem
                  key={sublink.title}
                  title={sublink.title}
                  href={sublink.href}
                  className="hover:bg-gray-800"
                >
                  {sublink.sublinks && sublink.sublinks.length > 0
                    ? sublink.sublinks.map((s) => s.title).join(', ')
                    : ''}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
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
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-red-500 focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-red-500">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Header;
