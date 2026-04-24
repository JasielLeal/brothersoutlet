'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { logout } = useLogout()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/login')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="bg-background flex h-16 items-center justify-between border-b px-6">
          <div />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
