import type { Order } from '@/features/orders/types/order.types'

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '2',
    items: [
      { productId: '1', productName: 'MacBook Pro 14"', quantity: 1, price: 19999.9 },
      { productId: '3', productName: 'Sony WH-1000XM5', quantity: 1, price: 1899.9 },
    ],
    total: 21899.8,
    status: 'delivered',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-25T15:00:00Z',
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  },
  {
    id: 'ORD-002',
    userId: '2',
    items: [{ productId: '4', productName: 'Tênis Nike Air Max 270', quantity: 2, price: 649.9 }],
    total: 1299.8,
    status: 'processing',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  },
  {
    id: 'ORD-003',
    userId: '3',
    items: [
      { productId: '5', productName: 'Clean Code', quantity: 3, price: 79.9 },
      { productId: '8', productName: 'Kindle Paperwhite', quantity: 1, price: 599.9 },
    ],
    total: 839.6,
    status: 'shipped',
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-06T08:30:00Z',
    shippingAddress: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
  },
]
