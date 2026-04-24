'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Heart, PackageCheck, Menu, X } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/useCart'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-white shadow-none'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Brothers Outlet"
            width={56}
            height={56}
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Search — hidden on mobile */}
        <div className="relative hidden max-w-xs flex-1 md:block lg:max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pr-4 pl-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1565a0]/40 focus:bg-white focus:ring-2 focus:ring-[#1565a0]/10 focus:outline-none"
          />
        </div>

        {/* Right actions */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <PackageCheck className="h-4 w-4" />
            Pedidos
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Heart className="h-4 w-4" />
            Favoritos
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1565a0] text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </span>
            Carrinho
          </Link>
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/cart"
            className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1565a0] text-[10px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search + nav */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar"
              className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pr-4 pl-9 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <PackageCheck className="h-4 w-4" /> Pedidos
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className="h-4 w-4" /> Favoritos
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
