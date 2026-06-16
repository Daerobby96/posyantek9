import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatRupiah } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'
import { ChevronRight, Package, RotateCcw, Star, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name, description').eq('id', id).single()
  return {
    title: data?.name ?? 'Produk',
    description: data?.description ?? '',
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const p = product as Product

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-7 animate-fade-up">
        <Link href="/" className="hover:text-green-700 transition-colors">Beranda</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-green-700 transition-colors">Produk</Link>
        {p.category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/products`} className="hover:text-green-700 transition-colors">
              {p.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-600 font-medium line-clamp-1 max-w-[200px]">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ── Image ── */}
        <div className="animate-fade-up">
          <div className="relative aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl overflow-hidden img-zoom shadow-md">
            {p.image_url ? (
              <Image
                src={p.image_url}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <span className="text-8xl animate-float">🧶</span>
                <span className="text-sm text-green-600 font-medium">Kerajinan Tangan</span>
              </div>
            )}

            {/* Stock overlay */}
            {p.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-6 py-3 rounded-2xl text-lg shadow-lg">
                  Stok Habis
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col animate-fade-up delay-100">
          {p.category && (
            <Link
              href={`/products`}
              className="inline-flex w-fit text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wide"
            >
              {p.category.name}
            </Link>
          )}

          <h1 className="text-3xl font-black text-gray-900 mt-3 leading-tight">{p.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.0 dari 24 ulasan)</span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-4xl font-black text-green-700">{formatRupiah(p.price)}</p>
          </div>

          {/* Stock indicator */}
          <div className="mt-4">
            {p.stock > 10 ? (
              <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 text-sm font-semibold px-4 py-2 rounded-xl border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce-subtle"></span>
                Stok tersedia ({p.stock} pcs)
              </span>
            ) : p.stock > 0 ? (
              <span className="inline-flex items-center gap-2 text-orange-700 bg-orange-50 text-sm font-semibold px-4 py-2 rounded-xl border border-orange-100">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Sisa {p.stock} pcs — segera pesan!
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-red-600 bg-red-50 text-sm font-semibold px-4 py-2 rounded-xl border border-red-100">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Stok habis
              </span>
            )}
          </div>

          {/* Description */}
          {p.description && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <h2 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{p.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6">
            <AddToCartButton product={p} />
          </div>

          {/* Trust badges */}
          <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3">
            {[
              { icon: Package, label: 'Dikemas dengan aman' },
              { icon: RotateCcw, label: 'Garansi kualitas' },
              { icon: Shield, label: 'Transaksi aman' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-gray-50 rounded-xl">
                <Icon size={16} className="text-green-600" />
                <span className="text-[10px] font-medium text-gray-600 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
