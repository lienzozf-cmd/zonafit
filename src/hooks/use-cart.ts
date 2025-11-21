
'use client'

import { useCartStore } from "@/components/store-provider"
import type { Product, ProductOption } from "@/lib/data"

export const useCart = () => {
  // State selectors
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.itemCount)
  const total = useCartStore((state) => state.total)
  const isCartOpen = useCartStore((state) => state.isCartOpen)
  const products = useCartStore((state) => state.products)

  // Action selectors
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const incrementQuantity = useCartStore((state) => state.incrementQuantity)
  const decrementQuantity = useCartStore((state) => state.decrementQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getItem = useCartStore((state) => state.getItem)
  const getProductOption = useCartStore((state) => state.getProductOption)

  return {
    items,
    itemCount,
    total,
    isCartOpen,
    setIsCartOpen,
    addItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItem,
    products,
    getProductOption
  }
}
