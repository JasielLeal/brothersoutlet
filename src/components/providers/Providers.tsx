'use client'

import { QueryProvider } from '@/lib/api/query-client'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>
}
