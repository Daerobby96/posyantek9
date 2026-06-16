'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Tag,
  Cpu, Newspaper, Image, Handshake, ChevronRight,
  ExternalLink, Settings,
} from 'lucide-react'
import { useState } from 'react'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Utama',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Toko Online',
    items: [
      { href: '/admin/products', label: 'Produk', icon: Package },
      { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
      { href: '/admin/categories', label: 'Kategori', icon: Tag },
    ],
  },
  {
    label: 'Konten Lembaga',
    items: [
      { href: '/admin/posts', label: 'Berita & Kegiatan', icon: Newspaper },
      { href: '/admin/ttg', label: 'Katalog TTG', icon: Cpu },
      { href: '/admin/gallery', label: 'Galeri', icon: Image },
      { href: '/admin/mitra', label: 'Mitra', icon: Handshake },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-40 transition-all duration-300 hidden lg:flex flex-col ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white text-xs font-black">PT</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-black text-sm leading-none">Posyantek</p>
              <p className="text-gray-500 text-[10px] mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                          active
                            ? 'bg-green-600 text-white shadow-md shadow-green-900/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        } ${collapsed ? 'justify-center' : ''}`}
                      >
                        <item.icon size={17} className={active ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight size={14} className="opacity-60" />}
                          </>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom: collapse toggle + view site */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link
            href="/"
            target="_blank"
            title={collapsed ? 'Lihat Website' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <ExternalLink size={16} />
            {!collapsed && <span>Lihat Website</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-gray-800 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <ChevronRight size={16} className={`transition-transform ${collapsed ? 'rotate-0' : 'rotate-180'}`} />
            {!collapsed && <span>Ciutkan</span>}
          </button>
        </div>
      </aside>

      {/* Mobile: bottom nav bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex justify-around py-2 px-1">
        {NAV_GROUPS[0].items.concat(NAV_GROUPS[1].items).slice(0, 5).map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                active ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
