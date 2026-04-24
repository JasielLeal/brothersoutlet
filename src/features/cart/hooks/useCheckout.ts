import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ordersService } from '@/features/orders/services/orders.service'
import { useCartStore } from '@/features/cart/store/cart.store'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { CheckoutInput } from '@/features/cart/schemas/checkout.schema'

export function useCheckout() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (data: CheckoutInput) => {
      if (!user) throw new Error('Você precisa estar logado para finalizar a compra')

      const shippingAddress = {
        street: `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ''}`,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      }

      return ordersService.createOrder(user.id, items, shippingAddress)
    },
    onSuccess: (order) => {
      clearCart()
      router.push(`/checkout/success?orderId=${order.id}`)
    },
  })
}
