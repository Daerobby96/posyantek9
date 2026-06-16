import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/types'
import { formatRupiah, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils'
import { Package, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allOrders = (orders as Order[]) || []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Package size={20} className="text-green-600" />
          </div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Pesanan</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Riwayat Pesanan</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {allOrders.length > 0 ? `${allOrders.length} pesanan ditemukan` : 'Belum ada pesanan'}
        </p>
      </div>

      {allOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 animate-fade-up">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Package size={36} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Pesanan</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Yuk mulai belanja produk UMKM binaan Posyantek!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm btn-press"
          >
            <ShoppingBag size={18} />
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-up delay-100">
          {allOrders.map((order, i) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className={`group block bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all card-hover animate-fade-up delay-${(i % 4) * 100}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-mono mb-1.5">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="font-black text-gray-900 text-lg">
                    {formatRupiah(order.total_amount)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Package size={11} className="text-gray-300" />
                      {formatDate(order.created_at)}
                    </p>
                    {order.shipping_name && (
                      <p className="text-xs text-gray-400 hidden sm:block">
                        {order.shipping_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick action */}
      {allOrders.length > 0 && (
        <div className="mt-8 text-center animate-fade-up">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm btn-press"
          >
            <ShoppingBag size={18} />
            Belanja Lagi
          </Link>
        </div>
      )}
    </div>
  )
}
