'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  FileAxis3D,
  PanelLeftClose,
  PanelLeftOpen,
  Truck,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/hooks/useAuth'
import { useAdminUiStore } from '@/store/admin-ui.store'
import { Separator } from '../ui/separator'

const MAIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/products', label: 'Produtos', icon: Package },
]

const BOTTOM_NAV = [{ href: '/admin/settings', label: 'Configurações', icon: Settings }]

const DOCS_NAV = [
  { label: 'Fornecedores', icon: Truck, href: '/admin/suppliers' },
  { label: 'Boletos', icon: FileAxis3D, href: '/admin/invoices' },
]

// ── shared nav content ─────────────────────────────────────────────────────────
function NavContent({
  collapsed = false,
  onLinkClick,
}: {
  collapsed?: boolean
  onLinkClick?: () => void
}) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { logout } = useLogout()

  return (
    <>
      <Separator />
      <nav className="mt-5 flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <p className="mb-1 px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            início
          </p>
        )}
        <ul className="space-y-0.5">
          {MAIN_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  onClick={onLinkClick}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    collapsed && 'justify-center px-2',
                    active
                      ? 'bg-[#4A6CF7]/8 text-[#4A6CF7]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-5">
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Documentos
            </p>
          )}
          <ul className="space-y-0.5">
            {DOCS_NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    onClick={onLinkClick}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-2',
                      active
                        ? 'bg-[#4A6CF7]/8 text-[#4A6CF7]'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-gray-100 px-2 py-3">
        <ul className="space-y-0.5">
          {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                title={collapsed ? label : undefined}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && label}
              </Link>
            </li>
          ))}
          <li>
            <button
              title={collapsed ? 'Ajuda' : undefined}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800',
                collapsed && 'justify-center px-2'
              )}
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              {!collapsed && 'Ajuda'}
            </button>
          </li>
        </ul>

        <div
          className={cn(
            'mt-2 flex items-center rounded-lg px-3 py-2',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {collapsed ? (
            <button
              onClick={logout}
              title="Sair"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-300"
            >
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                  {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    {user?.name ?? 'Admin'}
                  </p>
                  <p className="truncate text-[10px] text-gray-400">{user?.email ?? ''}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sair"
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ── main component ─────────────────────────────────────────────────────────────
export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const mobileOpen = useAdminUiStore((s) => s.mobileSidebarOpen)
  const closeMobileSidebar = useAdminUiStore((s) => s.closeMobileSidebar)

  return (
    <>
      {/* ── Desktop sidebar (in flex layout) ──────────────────────────────── */}
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-200 md:flex',
          collapsed ? 'w-15' : 'w-56'
        )}
      >
        <div className="flex h-14 items-center justify-between px-3">
          {!collapsed && (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300">
                <span className="text-[10px] font-bold text-gray-600">BO</span>
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-800">
                Brothers Outlet
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600',
              collapsed && 'mx-auto'
            )}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
        <NavContent collapsed={collapsed} />
      </aside>

      {/* ── Mobile drawer via portal ───────────────────────────────────────── */}
      {mounted &&
        createPortal(
          <>
            <div
              className={cn(
                'fixed inset-0 z-9998 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden',
                mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              )}
              onClick={closeMobileSidebar}
            />
            <aside
              className={cn(
                'fixed top-0 left-0 z-9999 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
              )}
            >
              <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300">
                    <span className="text-[10px] font-bold text-gray-600">BO</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Brothers Outlet</span>
                </div>
                <button
                  onClick={closeMobileSidebar}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Fechar menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavContent onLinkClick={closeMobileSidebar} />
            </aside>
          </>,
          document.body
        )}
    </>
  )
}
