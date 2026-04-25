'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Heart, PackageCheck, Menu, X, Clock } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useState, useEffect, useRef } from 'react'

const RECENT_KEY = 'recent_searches'
const MAX_RECENT = 5

export function Navbar() {
  const { itemCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const mobileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleMobileSearch() {
    if (!mobileSearchOpen) {
      try {
        const stored = localStorage.getItem(RECENT_KEY)
        setRecentSearches(stored ? JSON.parse(stored) : [])
      } catch {
        setRecentSearches([])
      }
      setMobileSearchOpen(true)
      setTimeout(() => mobileInputRef.current?.focus(), 50)
    } else {
      setMobileSearchOpen(false)
    }
  }

  function saveRecent(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      const current: string[] = stored ? JSON.parse(stored) : []
      const updated = [trimmed, ...current.filter((s) => s !== trimmed)].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
      setRecentSearches(updated)
    } catch {}
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = search.trim()
    if (q) {
      saveRecent(q)
      router.push(`/search?q=${encodeURIComponent(q)}`)
      setMobileOpen(false)
      setMobileSearchOpen(false)
      setSearch('')
    }
  }

  function handleRecentClick(q: string) {
    saveRecent(q)
    router.push(`/search?q=${encodeURIComponent(q)}`)
    setMobileSearchOpen(false)
    setSearch('')
  }

  function removeRecent(q: string) {
    const updated = recentSearches.filter((s) => s !== q)
    setRecentSearches(updated)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    } catch {}
  }

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

        {/* Search — desktop only */}
        <form
          onSubmit={handleSearch}
          className="relative hidden max-w-xs flex-1 md:block lg:max-w-sm"
        >
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pr-4 pl-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1565a0]/40 focus:bg-white focus:ring-2 focus:ring-[#1565a0]/10 focus:outline-none"
          />
        </form>

        {/* Right actions — desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <PackageCheck className="h-4 w-4" />
            Pedidos
          </Link>

          <Link
            href="/favoritos"
            className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="relative">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </span>
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

        {/* Mobile: search + cart + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            className={`rounded-md p-2 transition-colors hover:bg-gray-100 ${mobileSearchOpen ? 'bg-gray-100 text-[#1565a0]' : 'text-gray-500'}`}
            onClick={() => {
              toggleMobileSearch()
              setMobileOpen(false)
            }}
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>

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
            onClick={() => {
              setMobileOpen((v) => !v)
              setMobileSearchOpen(false)
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search panel */}
      {mobileSearchOpen && (
        <div className="border-t bg-white px-4 pt-3 pb-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={mobileInputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pr-10 pl-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1565a0]/40 focus:bg-white focus:ring-2 focus:ring-[#1565a0]/10 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {recentSearches.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Pesquisas recentes
              </p>
              <ul className="flex flex-col gap-0.5">
                {recentSearches.map((q) => (
                  <li key={q} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRecentClick(q)}
                      className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      {q}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRecent(q)}
                      className="rounded p-1 text-gray-300 hover:text-gray-500"
                      aria-label={`Remover ${q}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <PackageCheck className="h-4 w-4" /> Pedidos
            </Link>
            <Link
              href="/favoritos"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <span className="relative">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </span>
              Favoritos{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
