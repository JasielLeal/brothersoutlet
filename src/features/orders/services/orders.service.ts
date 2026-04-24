import { mockOrders } from '@/mock/orders'
import type { Order } from '@/features/orders/types/order.types'
import type { CartItem } from '@/features/cart/types/cart.types'

const FAKE_DELAY = 700

export const ordersService = {
  async getOrders(userId?: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    if (userId) return mockOrders.filter((o) => o.userId === userId)
    return mockOrders
  },

  async getOrderById(id: string): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const order = mockOrders.find((o) => o.id === id)
    if (!order) throw new Error('Pedido não encontrado')
    return order
  },

  async createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: Order['shippingAddress']
  ): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))
    const newOrder: Order = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      userId,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOrders.push(newOrder)
    return newOrder
  },
}
