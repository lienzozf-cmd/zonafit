
import { create } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product } from '@/lib/data';

export type ProductStore = {
  products: Product[];
  decreaseStock: (productId: number, colorName: string, optionValue: string, quantity?: number) => void;
  increaseStock: (productId: number, colorName: string, optionValue: string, quantity: number) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: initialProducts,
  decreaseStock: (productId, colorName, optionValue, quantity = 1) => {
    set(produce((draft: ProductStore) => {
      const product = draft.products.find(p => p.id === productId);
      if (product) {
        if (product.colors && product.colors.length > 0 && colorName !== 'default') {
          const color = product.colors.find(c => c.name === colorName);
          if (color) {
            const option = color.options.values.find(v => v.value === optionValue);
            if (option) {
              option.stock = Math.max(0, option.stock - quantity);
            }
          }
        } else {
          const option = product.options.values.find(v => v.value === optionValue);
          if (option) {
            option.stock = Math.max(0, option.stock - quantity);
          }
        }
      }
    }));
  },
  increaseStock: (productId, colorName, optionValue, quantity) => {
      set(produce((draft: ProductStore) => {
          const product = draft.products.find(p => p.id === productId);
          if (product) {
              if (product.colors && product.colors.length > 0 && colorName !== 'default') {
                  const color = product.colors.find(c => c.name === colorName);
                  if (color) {
                      const option = color.options.values.find(v => v.value === optionValue);
                      if (option) {
                          option.stock += quantity;
                      }
                  }
              } else {
                  const option = product.options.values.find(v => v.value === optionValue);
                  if (option) {
                      option.stock += quantity;
                  }
              }
          }
      }));
  },
}));
