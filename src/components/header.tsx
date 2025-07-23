'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  ChevronRight,
  Dumbbell,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
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

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-lg">
            ZONA FIT GT
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex">
            <DesktopNav />
          </nav>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-10" />
            </div>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
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
          <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {link.sublinks.map((sublink) => (
                <ListItem
                  key={sublink.title}
                  title={sublink.title}
                  href={sublink.href}
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
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open Menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <div className="p-4">
      <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">
            ZONA FIT GT
          </span>
        </Link>
        <Accordion type="single" collapsible className="w-full">
          {navLinks.map((link) => (
            <AccordionItem value={link.title} key={link.title}>
              <AccordionTrigger>{link.title}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-4">
                  {link.sublinks.map((sublink) =>
                    sublink.sublinks && sublink.sublinks.length > 0 ? (
                       <Accordion type="single" collapsible key={sublink.title}>
                         <AccordionItem value={sublink.title}>
                           <AccordionTrigger className="py-2 text-sm">{sublink.title}</AccordionTrigger>
                           <AccordionContent>
                              <div className="flex flex-col space-y-2 pl-4">
                                {sublink.sublinks.map((s) => (
                                    <SheetClose asChild key={s.title}>
                                      <Link href={s.href} className="text-muted-foreground hover:text-foreground py-1">{s.title}</Link>
                                    </SheetClose>
                                ))}
                              </div>
                           </AccordionContent>
                         </AccordionItem>
                       </Accordion>
                    ) : (
                      <SheetClose asChild key={sublink.title}>
                        <Link href={sublink.href} className="py-1">{sublink.title}</Link>
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
