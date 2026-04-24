export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}
