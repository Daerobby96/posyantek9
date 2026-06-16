import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Package, ShoppingBag, Users, TrendingUp,
  Plus, ArrowRight, Clock, CheckCircle2, Truck, XCircle,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { count: pendingOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
  ])

  const totalRevenue = recentOrders?.reduce((s, o) => s + o.total_amount, 0) || 0

  const STATUS_ICON: Record<string, React.ReactNode> = {
    pending:    <Clock size={13} className="text-yellow-400" />,
    processing: <TrendingUp size={13} className="text-blue-400" />,
    shipped:    <Truck size={13} className="text-purple-400" />,
    delivered:  <CheckCircle2 size={13} className="text-green-400" />,
    cancelled:  <XCircle size={13} className="text-red-400" />,
  }
  const STATUS_LABEL: Record<string, string> = {
    pending: 'Menunggu', processing: 'Diproses',
    shipped: 'Dikirim', delivered: 'Selesai', cancelled: 'Dibatalkan',
  }
  const STATUS_COLOR: Record<string, string> = {
    pending:    'bg-yellow-900/40 text-yellow-300 border-yellow-800',
    processing: 'bg-blue-900/40 text-blue-300 border-blue-800',
    shipped:    'bg-purple-900/40 text-purple-300 border-purple-800',
    delivered:  'bg-green-900/40 text-green-300 border-green-800',
    cancelled:  'bg-red-900/40 text-red-300 border-red-800',
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang di panel admin Posyantek
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Produk', value: totalProducts ?? 0,
            icon: Package, color: 'from-blue-600 to-blue-700',
            sub: 'produk terdaftar', href: '/admin/products',
          },
          {
            label: 'Total Pesanan', value: totalOrders ?? 0,
            icon: ShoppingBag, color: 'from-green-600 to-emerald-700',
            sub: `${pendingOrders ?? 0} menunggu`, href: '/admin/orders',
          },
          {
            label: 'Pengguna', value: totalUsers ?? 0,
            icon: Users, color: 'from-purple-600 to-violet-700',
            sub: 'akun terdaftar', href: '/admin',
          },
          {
            label: 'Pendapatan', value: formatRupiah(totalRevenue),
            icon: TrendingUp, color: 'from-amber-500 to-orange-600',
            sub: 'dari pesanan recent', href: '/admin/orders', isText: true,
          },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 hover:bg-gray-750 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <s.icon size={18} className="text-white" />
              </div>
              <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className={`font-black text-white leading-none ${s.isText ? 'text-base' : 'text-3xl'}`}>
              {s.isText ? s.value : (s.value as number).toLocaleString('id-ID')}
            </p>
            <p className="text-gray-500 text-xs mt-1.5">{s.label}</p>
            <p className="text-gray-600 text-[10px] mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent orders table */}
        <div className="xl:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <div>
              <h2 className="text-white font-bold">Pesanan Terbaru</h2>
              <p className="text-gray-500 text-xs mt-0.5">{recentOrders?.length || 0} pesanan</p>
            </div>
            <Link href="/admin/orders" className="text-xs text-green-400 hover:text-green-300 font-semibold transition-colors flex items-center gap-1">
              Semua <ArrowRight size={12} />
            </Link>
          </div>

          {!recentOrders?.length ? (
            <div className="py-12 text-center text-gray-600 text-sm">
              Belum ada pesanan masuk
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-700/60">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-700/40 hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white text-xs">
                        {formatRupiah(order.total_amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                          {STATUS_ICON[order.status]}
                          {STATUS_LABEL[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Package size={16} className="text-blue-400" /> Produk
            </h2>
            <div className="space-y-1.5">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
              >
                <Plus size={15} />
                Tambah Produk Baru
              </Link>
              {[
                { href: '/admin/products', label: 'Daftar Produk' },
                { href: '/admin/categories', label: 'Kelola Kategori' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <span>{l.label}</span>
                  <ArrowRight size={13} className="text-gray-600" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShoppingBag size={16} className="text-green-400" /> Pesanan
            </h2>
            <div className="space-y-1.5">
              {[
                { href: '/admin/orders?status=pending', label: 'Menunggu Konfirmasi', badge: pendingOrders || 0 },
                { href: '/admin/orders?status=processing', label: 'Sedang Diproses' },
                { href: '/admin/orders', label: 'Semua Pesanan' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <span>{l.label}</span>
                  <div className="flex items-center gap-2">
                    {l.badge != null && l.badge > 0 && (
                      <span className="bg-yellow-500 text-yellow-950 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {l.badge}
                      </span>
                    )}
                    <ArrowRight size={13} className="text-gray-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
