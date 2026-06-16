'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { CartItem } from '@/lib/types'
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '@/lib/cart'
import { formatRupiah } from '@/lib/utils'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCart(getCart())
    setMounted(true)
  }, [])

  const syncCart = (updated: CartItem[]) => {
    setCart(updated)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleRemove = (productId: string) => syncCart(removeFromCart(productId))

  const handleQtyChange = (productId: string, qty: number) => {
    if (qty < 1) { syncCart(removeFromCart(productId)); return }
    syncCart(updateCartQuantity(productId, qty))
  }

  const total = getCartTotal(cart)

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="skeleton h-8 w-48 mx-auto mb-4" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center animate-fade-up">
        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={36} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-3">Keranjang Masih Kosong</h1>
        <p className="text-gray-500 mb-8">
          Belum ada produk yang dipilih. Yuk mulai jelajahi koleksi kerajinan kami!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md btn-press"
        >
          <ShoppingBag size={18} />
          Mulai Belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-7 animate-fade-up">
        <h1 className="text-3xl font-black text-gray-900">Keranjang Belanja</h1>
        <p className="text-gray-500 mt-1 text-sm">{cart.length} produk dalam keranjang</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Cart Items ── */}
        <div className="lg:col-span-2 space-y-3 animate-fade-up delay-100">
          {cart.map((item, i) => (
            <div
              key={item.product.id}
              className={`bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 card-hover animate-fade-up delay-${i * 100}`}
            >
              {/* Image */}
              <Link href={`/products/${item.product.id}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-green-50 shrink-0 img-zoom">
                {item.product.image_url ? (
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🧶</div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} className="font-bold text-gray-800 hover:text-green-700 transition-colors line-clamp-1 text-sm">
                  {item.product.name}
                </Link>
                {item.product.category && (
                  <span className="text-xs text-green-600 font-medium">{(item.product as { category?: { name: string } }).category?.name}</span>
                )}
                <p className="text-green-700 font-black text-base mt-1">{formatRupiah(item.product.price)}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQtyChange(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-sm">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800 transition-colors py-2 px-1"
          >
            ← Lanjut Belanja
          </Link>
        </div>

        {/* ── Order Summary ── */}
        <div className="lg:col-span-1 animate-fade-up delay-200">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 shadow-sm">
            <h2 className="font-black text-gray-800 mb-5 text-lg">Ringkasan Pesanan</h2>

            <div className="space-y-2.5 text-sm mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between gap-2 text-gray-600">
                  <span className="line-clamp-1 flex-1">{item.product.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="shrink-0 font-medium text-gray-800">{formatRupiah(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatRupiah(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1.5">
                <span>Ongkir</span>
                <span className="text-green-600 font-medium">Dihitung saat checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between font-black text-gray-900 text-lg">
                <span>Total</span>
                <span className="text-green-700">{formatRupiah(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow btn-press"
            >
              Lanjut ke Checkout
              <ArrowRight size={18} />
            </Link>

            {/* Payment badges */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Tag size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">Transfer Bank · COD tersedia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
