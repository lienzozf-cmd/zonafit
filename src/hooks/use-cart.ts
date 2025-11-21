
'use client'

import { useCartStore } from "@/components/store-provider"

export const useCart = () => {
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.itemCount)
  const total = useCartStore((state) => state.total)
  const isCartOpen = useCartStore((state) => state.isCartOpen)
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const incrementQuantity = useCartStore((state) => state.incrementQuantity)
  const decrementQuantity = useCartStore((state) => state.decrementQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getItem = useCartStore((state) => state.getItem)

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
  }
}
