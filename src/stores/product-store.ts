
import { create } from 'zustand';
import { produce } from 'immer';
import { products as initialProducts, type Product, type ProductOption } from '@/lib/data';

export type ProductStore = {
  products: Product[];
  decreaseStock: (productId: number, quantity: number, optionValue: string, colorName?: string) => boolean;
  increaseStock: (productId: number, quantity: number, optionValue: string, colorName?: string) => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initialProducts,
  decreaseStock: (productId, quantity, optionValue, colorName) => {
    let stockUpdated = false;
    set(produce((draft: ProductStore) => {
      const product = draft.products.find(p => p.id === productId);
      if (!product) return;

      let option: ProductOption | undefined;

      if (colorName) {
        const color = product.colors?.find(c => c.name === colorName);
        if (color) {
          option = color.options.values.find(v => v.value === optionValue);
        }
      } else if (product.options) {
        option = product.options.values.find(v => v.value === optionValue);
      }
      
      if (option && option.stock >= quantity) {
        option.stock -= quantity;
        stockUpdated = true;
      }
    }));
    return stockUpdated;
  },
  increaseStock: (productId, quantity, optionValue, colorName) => {
    set(produce((draft: ProductStore) => {
      const product = draft.products.find(p => p.id === productId);
      if (!product) return;

      let option: ProductOption | undefined;

      if (colorName) {
        const color = product.colors?.find(c => c.name === colorName);
        if (color) {
          option = color.options.values.find(v => v.value === optionValue);
        }
      } else if (product.options) {
        option = product.options.values.find(v => v.value === optionValue);
      }

      if (option) {
        option.stock += quantity;
      }
    }));
  },
}));
