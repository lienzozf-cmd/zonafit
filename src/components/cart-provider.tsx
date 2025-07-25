'use client';
import { type ReactNode, useRef } from 'react';
import { type StoreApi } from 'zustand';
import { CartStoreContext, type CartStore, createCartStore } from '@/stores/cart-store';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<CartStore>>();
  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>;
};

export default CartProvider;
