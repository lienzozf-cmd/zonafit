'use client';
import { type ReactNode, useRef, useContext } from 'react';
import { type StoreApi } from 'zustand';
import { CartStoreContext, type CartStore, createCartStore } from '@/stores/cart-store';
import { ProductStoreContext, useProductStore } from '@/stores/product-store';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<CartStore>>();
  const productStore = useProductStore();

  if (!storeRef.current) {
    storeRef.current = createCartStore(productStore as any);
  }

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>;
};

export default CartProvider;
