import { useWishlistStore } from '@/features/wishlist/store/wishlist.store'

export function useWishlist() {
  const { items, addItem, removeItem, toggleItem, isWishlisted, clear } = useWishlistStore()

  return {
    items,
    count: items.length,
    addItem,
    removeItem,
    toggleItem,
    isWishlisted,
    clear,
    isEmpty: items.length === 0,
  }
}
