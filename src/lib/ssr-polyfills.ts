/**
 * SSR Polyfills for browser APIs
 * This file should be imported at the very top of the root layout or entry point.
 */

if (typeof window === 'undefined') {
  console.log('[SSR Polyfills] Injecting dummy localStorage/sessionStorage');
  const dummyStorage = {
    getItem: (key: string) => {
      console.log(`[SSR Polyfills] localStorage.getItem('${key}') called`);
      return null;
    },
    setItem: (key: string, value: string) => {
      console.log(`[SSR Polyfills] localStorage.setItem('${key}', '${value}') called`);
    },
    removeItem: (key: string) => {
      console.log(`[SSR Polyfills] localStorage.removeItem('${key}') called`);
    },
    clear: () => {
      console.log(`[SSR Polyfills] localStorage.clear() called`);
    },
    length: 0,
    key: (index: number) => null,
  };

  // Define global localStorage/sessionStorage
  Object.defineProperty(global, 'localStorage', {
    value: dummyStorage,
    writable: true,
    configurable: true
  });

  Object.defineProperty(global, 'sessionStorage', {
    value: dummyStorage,
    writable: true,
    configurable: true
  });
}
