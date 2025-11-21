
'use client'

import { useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { CartStoreContext } from '@/components/store-provider'
import type { CartStore } from '@/stores/cart-store'

export const useCart = () => {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCart must be use within CartStoreProvider`)
  }

  return useStore(cartStoreContext, (store) => store)
}
