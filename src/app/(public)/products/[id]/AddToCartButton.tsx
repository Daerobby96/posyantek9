'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Zap } from 'lucide-react'
import { Product } from '@/lib/types'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product, qty)
    window.dispatchEvent(new Event('cartUpdated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (product.stock === 0) {
    return (
      <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed text-sm">
        Stok Habis
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-600">Jumlah:</span>
        <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center font-bold text-gray-800">{qty}</span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-gray-400">Maks. {product.stock}</span>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all btn-press shadow-sm hover:shadow-md ${
          added
            ? 'bg-green-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        <ShoppingCart size={20} className={added ? 'animate-bounce-subtle' : ''} />
        {added ? '✓ Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}
      </button>

      {/* Buy now */}
      <Link
        href="/cart"
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base border-2 border-green-600 text-green-700 hover:bg-green-50 transition-all"
      >
        <Zap size={18} />
        Beli Sekarang
      </Link>
    </div>
  )
}
