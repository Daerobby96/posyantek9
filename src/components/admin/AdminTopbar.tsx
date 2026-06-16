'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, ChevronDown, LogOut, User, ExternalLink, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Breadcrumb map
const BREADCRUMB: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Produk',
  '/admin/products/new': 'Tambah Produk',
  '/admin/orders': 'Pesanan',
  '/admin/categories': 'Kategori',
  '/admin/posts': 'Berita & Kegiatan',
  '/admin/ttg': 'Katalog TTG',
  '/admin/gallery': 'Galeri',
  '/admin/mitra': 'Mitra',
  '/admin/settings': 'Pengaturan',
}

function getBreadcrumb(pathname: string): { label: string; href: string }[] {
  // Crumb pertama selalu "Admin → /admin"
  const crumbs: { label: string; href: string }[] = [{ label: 'Admin', href: '/admin' }]
  if (pathname === '/admin') return crumbs

  // Mulai dari index 1 (skip segment 'admin' yang sudah jadi crumb pertama)
  const parts = pathname.split('/').filter(Boolean) // ['admin', 'products', 'new']
  let built = ''
  for (let i = 0; i < parts.length; i++) {
    built += '/' + parts[i]
    if (built === '/admin') continue // sudah ada di crumb pertama, skip
    const label =
      BREADCRUMB[built] ||
      (parts[i].length < 12
        ? parts[i].replace(/-/g, ' ')
        : parts[i].slice(0, 8).toUpperCase() + '...')
    crumbs.push({ label, href: built })
  }
  return crumbs
}

interface Props {
  userName: string
  userEmail: string
}

export default function AdminTopbar({ userName, userEmail }: Props) {
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const breadcrumbs = getBreadcrumb(pathname)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">

      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle — handled by sidebar's bottom nav, this is just spacer */}
        <div className="lg:hidden w-8" />

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-700">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white font-semibold capitalize">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-500 hover:text-gray-300 transition-colors capitalize">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile: just page title */}
        <span className="sm:hidden text-white font-semibold text-sm capitalize">
          {breadcrumbs[breadcrumbs.length - 1]?.label}
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">

        {/* View website */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink size={12} />
          Lihat Website
        </Link>

        {/* Notification bell (placeholder) */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all ${
              dropOpen ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-black">{initials || 'A'}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-xs font-semibold leading-none">{userName.split(' ')[0]}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">Administrator</p>
            </div>
            <ChevronDown size={13} className={`text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl py-2 animate-scale-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-black">{initials || 'A'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-none truncate">{userName}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{userEmail}</p>
                  </div>
                </div>
                <span className="mt-2 inline-block text-[10px] font-bold bg-green-900/60 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                  Administrator
                </span>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setDropOpen(false)}
                >
                  <User size={14} className="text-gray-500" />
                  Profil Saya
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setDropOpen(false)}
                >
                  <ExternalLink size={14} className="text-gray-500" />
                  Lihat Website
                </Link>
              </div>

              <div className="border-t border-gray-700 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={14} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
