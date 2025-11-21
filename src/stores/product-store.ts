import * as React from 'react';
import { createContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { products as initialProducts, type Product } from '@/lib/data';

export type ProductStore = {
  products: Product[];
};

export const createProductStore = () =>
  createStore<ProductStore>(() => ({
    products: initialProducts,
}));

export const ProductStoreContext = createContext<ReturnType<typeof createProductStore> | null>(null);

export const useProductStore = () => {
    const store = ProductStoreContext;
    const context = React.useContext(store);
  
    if (!context) {
      throw new Error('useProductStore must be used within a ProductProvider');
    }
  
    return useZustandStore(context);
};
