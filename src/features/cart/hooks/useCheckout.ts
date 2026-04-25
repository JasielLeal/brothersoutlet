import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ordersService } from '@/features/orders/services/orders.service'
import { useCartStore } from '@/features/cart/store/cart.store'
import type { CheckoutInput } from '@/features/cart/schemas/checkout.schema'

export function useCheckout() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()

  return useMutation({
    mutationFn: async (data: CheckoutInput) => {
      const shippingAddress = {
        street:
          data.deliveryType === 'delivery'
            ? `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ''}`
            : 'Retirada na loja',
        city: data.deliveryType === 'delivery' ? (data.city ?? '') : 'Retirada',
        state: data.deliveryType === 'delivery' ? (data.state ?? '') : '',
        zipCode: data.deliveryType === 'delivery' ? (data.zipCode ?? '') : '',
      }

      return ordersService.createOrder('guest', items, shippingAddress)
    },
    onSuccess: (order, data) => {
      clearCart()
      const name = encodeURIComponent(data.fullName)
      const method = encodeURIComponent(data.paymentMethod)
      router.push(`/checkout/success?orderId=${order.id}&name=${name}&method=${method}`)
    },
  })
}
