import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Order, OrderItem } from '@/lib/types'
import { formatRupiah, formatDate, getStatusLabel, getPaymentLabel } from '@/lib/utils'
import UpdateOrderStatus from './UpdateOrderStatus'
import { ArrowLeft, MapPin, Phone, Hash, Calendar, User, CreditCard } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Detail Pesanan' }

const STATUS_COLOR: Record<string, string> = {
  pending:    'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  processing: 'bg-blue-900/40 text-blue-300 border-blue-800',
  shipped:    'bg-purple-900/40 text-purple-300 border-purple-800',
  delivered:  'bg-green-900/40 text-green-300 border-green-800',
  cancelled:  'bg-red-900/40 text-red-300 border-red-800',
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(id, name, image_url))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: buyerProfile } = await supabase
    .from('profiles')
    .select('full_name, phone, email:id')
    .eq('id', order.user_id)
    .single()

  const o = order as Order & {
    order_items: (OrderItem & { product: { id: string; name: string; image_url: string | null } | null })[]
  }

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">
            Pesanan <span className="font-mono text-green-400">#{o.id.slice(0, 8).toUpperCase()}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{formatDate(o.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left: Items + Buyer ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Order items */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-700">
              <h2 className="text-white font-bold">Produk Dipesan</h2>
              <p className="text-gray-500 text-xs mt-0.5">{o.order_items?.length || 0} item</p>
            </div>
            <div className="divide-y divide-gray-700/50">
              {o.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-700 shrink-0">
                    {item.product?.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product?.name || ''}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🧶</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm line-clamp-1">
                      {item.product?.name || 'Produk dihapus'}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {formatRupiah(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-white text-sm shrink-0">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="px-5 py-4 border-t border-gray-700 flex items-center justify-between">
              <span className="text-gray-400 font-semibold">Total Pesanan</span>
              <span className="text-xl font-black text-green-400">{formatRupiah(o.total_amount)}</span>
            </div>
          </div>

          {/* Buyer info */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <User size={15} className="text-gray-400" /> Info Pembeli
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User,     label: 'Nama Penerima', value: o.shipping_name || buyerProfile?.full_name || '—' },
                { icon: Phone,    label: 'Telepon',       value: o.shipping_phone },
                { icon: MapPin,    label: 'Alamat',        value: o.shipping_address },
                { icon: MapPin,    label: 'Kota',          value: o.shipping_city },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <row.icon size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{row.label}</p>
                    <p className="text-gray-200 text-sm mt-0.5">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {o.notes && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-1">Catatan</p>
                <p className="text-gray-300 text-sm bg-gray-700/50 rounded-xl px-3 py-2">{o.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Status + Info ── */}
        <div className="space-y-5">

          {/* Status card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4">Status Pesanan</h2>
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${STATUS_COLOR[o.status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                {getStatusLabel(o.status)}
              </span>
            </div>
            <UpdateOrderStatus orderId={o.id} currentStatus={o.status} />
          </div>

          {/* Order info */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4">Ringkasan</h2>
            <div className="space-y-3">
              {[
                { icon: Hash,       label: 'ID Pesanan', value: `#${o.id.slice(0, 8).toUpperCase()}`, mono: true },
                { icon: Calendar,   label: 'Tanggal',       value: formatDate(o.created_at) },
                { icon: CreditCard, label: 'Pembayaran',    value: getPaymentLabel(o.payment_method || 'transfer') },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                    <row.icon size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{row.label}</p>
                    <p className={`text-gray-200 text-sm mt-0.5 ${row.mono ? 'font-mono' : ''}`}>{row.value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-700">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide mb-1">Total</p>
                <p className="text-2xl font-black text-green-400">{formatRupiah(o.total_amount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
