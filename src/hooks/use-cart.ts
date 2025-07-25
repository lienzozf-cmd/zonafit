'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { CartStoreContext, type CartStore } from '@/stores/cart-store';

export const useCart = () => {
  const store = useContext(CartStoreContext);
  if (!store) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return useStore(store);
};
