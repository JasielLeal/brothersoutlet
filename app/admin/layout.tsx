'use client'

import { type ReactNode } from 'react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  // useEffect(() => {
  //   if (!isAuthenticated || user?.role !== 'admin') {
  //     router.replace('/login')
  //   }
  // }, [isAuthenticated, user, router])

  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return null
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
