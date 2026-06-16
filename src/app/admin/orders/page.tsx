import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/types'
import { formatRupiah, formatDate, getStatusLabel } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pesanan' }

const STATUS_COLOR: Record<string, string> = {
  pending:    'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  processing: 'bg-blue-900/40 text-blue-300 border-blue-800',
  shipped:    'bg-purple-900/40 text-purple-300 border-purple-800',
  delivered:  'bg-green-900/40 text-green-300 border-green-800',
  cancelled:  'bg-red-900/40 text-red-300 border-red-800',
}

interface SearchParams { status?: string }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (params.status) query = query.eq('status', params.status)

  const { data: orders } = await query
  const allOrders = (orders as Order[]) || []

  const tabs = [
    { label: 'Semua', value: '' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Diproses', value: 'processing' },
    { label: 'Dikirim', value: 'shipped' },
    { label: 'Selesai', value: 'delivered' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ]

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-black text-white">Pesanan</h1>
        <p className="text-gray-500 text-sm mt-1">{allOrders.length} pesanan ditemukan</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              (params.status || '') === tab.value
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {allOrders.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700 border-dashed">
          <p className="text-gray-500">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {['ID Pesanan', 'Total', 'Kota', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white text-sm">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{order.shipping_city}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-900/30 transition-colors"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
