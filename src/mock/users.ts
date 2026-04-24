import type { User } from '@/features/auth/types/auth.types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@admin.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    createdAt: '2024-01-03T00:00:00Z',
  },
]

export const MOCK_CREDENTIALS = {
  admin: { email: 'admin@admin.com', password: '123456' },
  customer: { email: 'joao@email.com', password: '123456' },
}
