import { mockUsers, MOCK_CREDENTIALS } from '@/mock/users'
import type { LoginCredentials, LoginResponse } from '@/features/auth/types/auth.types'

const FAKE_DELAY = 800

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY))

    const user = mockUsers.find(
      (u) =>
        u.email === credentials.email &&
        (credentials.email === MOCK_CREDENTIALS.admin.email
          ? credentials.password === MOCK_CREDENTIALS.admin.password
          : credentials.password === MOCK_CREDENTIALS.customer.password)
    )

    if (!user) {
      throw new Error('E-mail ou senha inválidos')
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`
    return { user, token }
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
  },

  async me(token: string) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const userId = token.split('-')[3]
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) throw new Error('Token inválido')
    return user
  },
}
