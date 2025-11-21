
'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'
import { CartStoreContext } from '@/components/store-provider'
import { type CartStore } from '@/stores/cart-store'

export const useCart = <T,>(
  selector: (store: CartStore) => T,
): T => {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCart must be used within a StoreProvider`)
  }

  return useStore(cartStoreContext, selector)
}
