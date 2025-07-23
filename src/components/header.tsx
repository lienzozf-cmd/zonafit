
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, navLinks } from '@/lib/data';
import type { Product } from '@/lib/data';

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
    const element = document.getElementById(`product-item-${product.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight');
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }
  };

  return (
    <header className="site-header">
      <div className="site-branding">
        <Link href="/">
          <Image src="/assets/images/logos/logo.png" alt="Zona Fit Logo" id="site-logo" width={150} height={80} data-ai-hint="logo" />
        </Link>
      </div>
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
      <div className="header-icons">
        <div className="search-container" ref={searchContainerRef}>
          <Image
            src="https://placehold.co/24x24.png"
            alt="Search Icon"
            className="search-icon"
            width={24}
            height={24}
            data-ai-hint="search icon"
            onClick={() => setIsSearchActive(!isSearchActive)}
          />
          <div className={`search-box ${isSearchActive ? 'active' : ''}`}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            />
            <button onClick={performSearch}>Buscar</button>
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
        <Image src="https://placehold.co/24x24.png" alt="Cart Icon" className="cart-icon" width={24} height={24} data-ai-hint="cart icon" />
      </div>
    </header>
  );
};

export default Header;
