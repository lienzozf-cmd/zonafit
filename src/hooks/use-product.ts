
'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'

import { ProductStoreContext } from '@/components/store-provider'

export const useProduct = () => {
  const productStoreContext = useContext(ProductStoreContext)

  if (!productStoreContext) {
    throw new Error(`useProduct must be use within ProductStoreProvider`)
  }

  return useStore(productStoreContext, (store) => store)
}
