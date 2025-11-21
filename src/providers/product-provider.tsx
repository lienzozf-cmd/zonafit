
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import {
  type ProductStore,
  createProductStore,
} from '@/stores/product-store'

export const ProductStoreContext = createContext<StoreApi<ProductStore> | null>(
  null,
)

export interface ProductStoreProviderProps {
  children: ReactNode
}

export const ProductStoreProvider = ({
  children,
}: ProductStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ProductStore>>()
  if (!storeRef.current) {
    storeRef.current = createProductStore()
  }

  return (
    <ProductStoreContext.Provider value={storeRef.current}>
      {children}
    </ProductStoreContext.Provider>
  )
}

export const useProductStore = <T,>(
  selector: (store: ProductStore) => T,
): T => {
  const productStoreContext = useContext(ProductStoreContext)

  if (!productStoreContext) {
    throw new Error(`useProductStore must be use within ProductStoreProvider`)
  }

  return useStore(productStoreContext, selector)
}
