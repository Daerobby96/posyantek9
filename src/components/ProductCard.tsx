'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import { Product } from '@/lib/types'
import { addToCart } from '@/lib/cart'
import { formatRupiah } from '@/lib/utils'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (added || product.stock === 0) return
    addToCart(product, 1)
    window.dispatchEvent(new Event('cartUpdated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
    >
      <article className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100/80 h-full flex flex-col">

        {/* Image area */}
        <div className="relative h-56 bg-gradient-to-br from-green-50 to-emerald-50 img-zoom overflow-hidden">
          {product.image_url && !imgError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100">
              <span className="text-xs text-gray-500 font-medium">Foto belum tersedia</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
              <Eye size={12} />
              Lihat Detail
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                Habis
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="bg-orange-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Sisa {product.stock}
              </span>
            )}
            {product.stock > 10 && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Tersedia
              </span>
            )}
          </div>

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-3 right-3">
              <span className="bg-white border border-gray-200 text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {product.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Rating placeholder */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">(4.0)</span>
          </div>

          <h3 className="font-semibold text-gray-800 line-clamp-2 leading-snug text-sm flex-1">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <p className="font-black text-green-700 text-lg leading-none">
              {formatRupiah(product.price)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all btn-press ${
              added
                ? 'bg-green-700 text-white'
                : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
            }`}
          >
            <ShoppingCart size={15} />
            {added ? '✓ Ditambahkan!' : product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </article>
    </Link>
  )
}
