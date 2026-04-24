import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/features/orders/services/orders.service'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const orderKeys = {
  all: ['orders'] as const,
  list: (userId?: string) => [...orderKeys.all, 'list', userId] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
}

export function useOrders() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: orderKeys.list(user?.id),
    queryFn: () => ordersService.getOrders(user?.role === 'admin' ? undefined : user?.id),
    enabled: Boolean(user),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: Boolean(id),
  })
}
