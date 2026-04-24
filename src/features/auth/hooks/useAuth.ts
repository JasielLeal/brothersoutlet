import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/features/auth/services/auth.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { LoginCredentials } from '@/features/auth/types/auth.types'

export function useLogin() {
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: ({ user, token }) => {
      login(user, token)
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const { logout } = useAuthStore()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return { logout: handleLogout }
}
