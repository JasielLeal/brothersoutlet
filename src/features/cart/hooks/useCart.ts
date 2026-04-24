import { useCartStore } from '@/features/cart/store/cart.store'

export function useCart() {
  const { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty: items.length === 0,
  }
}
