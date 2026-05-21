export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dummyStorage = {
      getItem: (key: string) => null,
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {},
      clear: () => {},
      length: 0,
      key: (index: number) => null,
    };

    if (!(global as any).localStorage) {
      (global as any).localStorage = dummyStorage;
    }
    
    if (!(global as any).sessionStorage) {
      (global as any).sessionStorage = dummyStorage;
    }
  }
}
