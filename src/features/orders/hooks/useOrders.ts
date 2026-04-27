import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/features/orders/services/orders.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { OrderStatus } from '@/features/orders/types/order.types'

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

export function useAdminOrders() {
  return useQuery({
    queryKey: orderKeys.list(undefined),
    queryFn: () => ordersService.getOrders(),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: Boolean(id),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.list(user?.id) })
    },
  })
}
