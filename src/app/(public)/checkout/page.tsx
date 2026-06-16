'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CartItem } from '@/lib/types'
import { getCart, getCartTotal, clearCart } from '@/lib/cart'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    payment_method: 'transfer' as 'transfer' | 'cod',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const items = getCart()
    if (items.length === 0) {
      router.push('/cart')
      return
    }
    setCart(items)

    // Pre-fill from profile
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      if (profile) {
        setForm((f) => ({
          ...f,
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
        }))
      }
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handlePaymentChange = (method: 'transfer' | 'cod') => {
    setForm((f) => ({ ...f, payment_method: method }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }

    const total = getCartTotal(cart)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userData.user.id,
        total_amount: total,
        status: 'pending',
        shipping_name: form.full_name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_phone: form.phone,
        payment_method: form.payment_method,
        notes: form.notes || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      setError('Gagal membuat pesanan. Silakan coba lagi.')
      setLoading(false)
      return
    }

    // Create order items
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      setError('Gagal menyimpan item pesanan.')
      setLoading(false)
      return
    }

    clearCart()
    window.dispatchEvent(new Event('cartUpdated'))
    router.push(`/orders/${order.id}?success=1`)
  }

  const total = getCartTotal(cart)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Form */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Informasi Pengiriman</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Nama lengkap penerima"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nomor HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kota/Kabupaten <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Nama kota"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Catatan (opsional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Catatan tambahan untuk pesanan..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Metode Pembayaran</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors ${
                  form.payment_method === 'transfer'
                    ? 'border-2 border-green-500 bg-green-50'
                    : 'border border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={form.payment_method === 'transfer'}
                  onChange={() => handlePaymentChange('transfer')}
                  className="accent-green-600"
                />
                <div>
                  <p className="font-medium text-sm text-gray-800">Transfer Bank</p>
                  <p className="text-xs text-gray-500">BCA / BRI / Mandiri</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors ${
                  form.payment_method === 'cod'
                    ? 'border-2 border-green-500 bg-green-50'
                    : 'border border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment_method === 'cod'}
                  onChange={() => handlePaymentChange('cod')}
                  className="accent-green-600"
                />
                <div>
                  <p className="font-medium text-sm text-gray-800">COD (Bayar di Tempat)</p>
                  <p className="text-xs text-gray-500">Tersedia untuk area tertentu</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Ringkasan</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="line-clamp-1 flex-1 mr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="shrink-0">{formatRupiah(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-green-700">{formatRupiah(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </button>
            <Link href="/cart" className="mt-2 w-full block text-center text-sm text-gray-500 hover:text-green-700 py-2">
              ← Kembali ke Keranjang
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
