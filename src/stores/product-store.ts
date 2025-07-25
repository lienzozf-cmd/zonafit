import { createContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { products as initialProducts, type Product } from '@/lib/data';

export type ProductStore = {
  products: Product[];
  decreaseStock: (productId: number, optionValue: string) => void;
  increaseStock: (productId: number, optionValue: string, quantity: number) => void;
};

export const createProductStore = () =>
  createStore<ProductStore>((set, get) => ({
    products: initialProducts,
    decreaseStock: (productId, optionValue) => {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              options: {
                ...product.options,
                values: product.options.values.map((option) => {
                  if (option.value === optionValue && option.stock > 0) {
                    return { ...option, stock: option.stock - 1 };
                  }
                  return option;
                }),
              },
            };
          }
          return product;
        }),
      }));
    },
    increaseStock: (productId, optionValue, quantity) => {
        set((state) => ({
          products: state.products.map((product) => {
            if (product.id === productId) {
              return {
                ...product,
                options: {
                  ...product.options,
                  values: product.options.values.map((option) => {
                    if (option.value === optionValue) {
                      return { ...option, stock: option.stock + quantity };
                    }
                    return option;
                  }),
                },
              };
            }
            return product;
          }),
        }));
      },
  }));

export const ProductStoreContext = createContext<ReturnType<
  typeof createProductStore
> | null>(null);

export const useProductStore = () => {
    const store = ProductStoreContext;
    const context = React.useContext(store);
  
    if (!context) {
      throw new Error('useProductStore must be used within a ProductProvider');
    }
  
    return useZustandStore(context);
};

// Add this import at the top of the file
import * as React from 'react';
