import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Order, OrderItem } from '@/lib/types'
import { formatRupiah, formatDate, getStatusLabel, getStatusColor, getPaymentLabel, getPaymentColor } from '@/lib/utils'
import { CheckCircle2, ArrowLeft, ShoppingBag, MapPin, Phone, FileText, Package, CreditCard } from 'lucide-react'

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  const o = order as Order & { order_items: (OrderItem & { product: { id: string; name: string; image_url: string | null } })[] }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Success banner */}
      {sp.success === '1' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4 animate-fade-up">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <div>
            <p className="font-bold text-green-800">Pesanan Berhasil Dibuat!</p>
            <p className="text-sm text-green-700 mt-0.5">
              Kami akan segera memproses pesanan Anda. Terima kasih telah berbelanja!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Detail Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">#{o.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${getStatusColor(o.status)}`}>
          {getStatusLabel(o.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm animate-fade-up delay-100">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-gray-400" />
          <h2 className="font-bold text-gray-800">Produk yang Dipesan</h2>
        </div>
        <div className="space-y-3">
          {o.order_items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {item.product?.image_url ? (
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={18} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.product?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatRupiah(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-gray-800 text-sm shrink-0">
                {formatRupiah(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-700">Total</span>
          <span className="text-xl font-black text-green-700">{formatRupiah(o.total_amount)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm animate-fade-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-gray-400" />
          <h2 className="font-bold text-gray-800">Info Pengiriman</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">Nama</span>
            <span className="text-gray-700 font-medium">{o.shipping_name || '-'}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">Telepon</span>
            <span className="text-gray-700 font-medium flex items-center gap-1.5">
              <Phone size={12} className="text-gray-300" />
              {o.shipping_phone}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">Alamat</span>
            <span className="text-gray-700 font-medium">{o.shipping_address}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">Kota</span>
            <span className="text-gray-700 font-medium">{o.shipping_city}</span>
          </div>
          {o.notes && (
            <div className="flex items-start gap-3">
              <span className="text-gray-400 w-16 shrink-0 text-xs pt-0.5">Catatan</span>
              <span className="text-gray-700 font-medium">{o.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment & Order Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm animate-fade-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-gray-400" />
          <h2 className="font-bold text-gray-800">Pembayaran & Pesanan</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tanggal Pesanan</span>
            <span className="text-gray-700 font-medium">{formatDate(o.created_at)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Metode Pembayaran</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getPaymentColor(o.payment_method || 'transfer')}`}>
              {getPaymentLabel(o.payment_method || 'transfer')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(o.status)}`}>
              {getStatusLabel(o.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 animate-fade-up delay-300">
        <Link
          href="/orders"
          className="flex-1 text-center py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Semua Pesanan
          </span>
        </Link>
        <Link
          href="/products"
          className="flex-1 text-center py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm shadow-sm btn-press"
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingBag size={14} /> Belanja Lagi
          </span>
        </Link>
      </div>
    </div>
  )
}
