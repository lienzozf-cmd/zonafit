import * as React from 'react';
import { createContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { products as initialProducts, type Product } from '@/lib/data';

export type ProductStore = {
  products: Product[];
  decreaseStock: (productId: number, colorName: string, optionValue: string) => void;
  increaseStock: (productId: number, colorName: string, optionValue: string, quantity: number) => void;
};

const productStore = createStore<ProductStore>((set, get) => ({
  products: initialProducts,
  decreaseStock: (productId, colorName, optionValue) => {
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id === productId) {
          const newColors = product.colors?.map(color => {
            if (color.name === colorName) {
              return {
                ...color,
                options: {
                  ...color.options,
                  values: color.options.values.map(option => {
                    if (option.value === optionValue && option.stock > 0) {
                      return { ...option, stock: option.stock - 1 };
                    }
                    return option;
                  }),
                },
              };
            }
            return color;
          });
          return { ...product, colors: newColors };
        }
        return product;
      }),
    }));
  },
  increaseStock: (productId, colorName, optionValue, quantity) => {
      set((state) => ({
        products: state.products.map((product) => {
          if (product.id === productId) {
            const newColors = product.colors?.map(color => {
                if(color.name === colorName) {
                    return {
                        ...color,
                        options: {
                            ...color.options,
                            values: color.options.values.map(option => {
                                if (option.value === optionValue) {
                                    return { ...option, stock: option.stock + quantity };
                                }
                                return option;
                            }),
                        },
                    };
                }
                return color;
            });
            return { ...product, colors: newColors };
          }
          return product;
        }),
      }));
    },
}));

export const ProductStoreContext = createContext<ReturnType<
  typeof createStore<ProductStore>
> | null>(null);

export const useProductStore = () => {
    const store = ProductStoreContext;
    const context = React.useContext(store);
  
    if (!context) {
      throw new Error('useProductStore must be used within a ProductProvider');
    }
  
    return useZustandStore(context);
};

export { productStore };
