'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShoppingCart, User, Menu, X, LogOut, ChevronDown,
  Package, BookOpen, Cpu, Wrench, Image, Handshake,
  Store, Newspaper, Building2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCartCount, getCart } from '@/lib/cart'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_ITEMS = [
  {
    label: 'Profil',
    href: '/profil',
    icon: Building2,
    children: [
      { href: '/profil#sejarah', label: 'Sejarah & Dasar Hukum' },
      { href: '/profil#visi-misi', label: 'Visi & Misi' },
      { href: '/profil#tujuan', label: 'Tujuan' },
      { href: '/profil#struktur', label: 'Struktur Organisasi' },
    ],
  },
  { label: 'TTG', href: '/ttg', icon: Cpu },
  { label: 'Layanan', href: '/layanan', icon: Wrench },
  { label: 'Berita', href: '/berita', icon: Newspaper },
  {
    label: 'UMKM',
    href: '/umkm',
    icon: Store,
    children: [
      { href: '/umkm', label: 'Produk UMKM Binaan' },
      { href: '/products', label: 'Toko Online' },
    ],
  },
  { label: 'Galeri', href: '/galeri', icon: Image },
  { label: 'Mitra', href: '/mitra', icon: Handshake },
]

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [role, setRole] = useState<string>('user')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: p }) => {
          if (p) setRole(p.role)
        })
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null)
      if (!s?.user) setRole('user')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const update = () => setCartCount(getCartCount(getCart()))
    update()
    window.addEventListener('storage', update)
    window.addEventListener('cartUpdated', update)
    return () => { window.removeEventListener('storage', update); window.removeEventListener('cartUpdated', update) }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false); setActiveDropdown(null); setUserMenuOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]))

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-green-800 text-green-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <span>📍 Posyantek Kecamatan Contoh, Kabupaten Contoh</span>
          <div className="flex items-center gap-4">
            <span>📞 (021) 1234-5678</span>
            <span>✉️ info@posyantek.id</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <span className="text-white text-sm font-black">PT</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-gray-900 text-base leading-none block">Posyantek</span>
              <span className="text-[10px] text-green-600 font-semibold leading-none">Pos Pelayanan Teknologi</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.href} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(item.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      isActive(item.href)
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={13} className={`transition-transform ${activeDropdown === item.href ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === item.href && (
                    <div
                      className="absolute left-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in"
                      onMouseEnter={() => setActiveDropdown(item.href)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive(item.href)
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all"
              aria-label="Keranjang"
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5 animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    userMenuOpen ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <User size={12} className="text-green-700" />
                  </div>
                  <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    {[
                      ...(role === 'admin' ? [{ href: '/admin', icon: Building2, label: 'Dashboard Admin' }] : []),
                      { href: '/profile', icon: User, label: 'Profil Saya' },
                      { href: '/orders', icon: Package, label: 'Pesanan Saya' },
                    ].map((m) => (
                      <Link key={m.href} href={m.href} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <m.icon size={14} className="text-gray-400" /> {m.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={14} /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link href="/login" className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all">
                  Masuk
                </Link>
                <Link href="/register" className="px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm btn-press">
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-5 pt-3 border-t border-gray-100 animate-fade-up space-y-0.5 max-h-[80vh] overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(item.href) ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={15} className="text-gray-400" />
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block px-3 py-2 text-sm text-gray-500 hover:text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <hr className="border-gray-100 my-2" />

            {user ? (
              <>
                {role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-green-700 hover:bg-green-50 transition-colors">
                    <Building2 size={15} className="text-green-600" /> Dashboard Admin
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={15} className="text-gray-400" /> Profil
                </Link>
                <Link href="/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Package size={15} className="text-gray-400" /> Pesanan
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Keluar
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link href="/login" className="flex-1 text-center py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm">Masuk</Link>
                <Link href="/register" className="flex-1 text-center py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm">Daftar</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
