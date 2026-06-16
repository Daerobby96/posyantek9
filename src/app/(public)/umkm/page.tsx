import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import { Product, Category } from '@/lib/types'
import { Store, ArrowRight, ShoppingBag, Sparkles, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Produk UMKM Binaan' }

export default async function UMKMPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const allProducts = (products as Product[]) || []
  const allCategories = (categories as Category[]) || []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Store size={20} className="text-purple-600" />
          </div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">UMKM</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Produk UMKM Binaan</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Hasil karya pelaku usaha mikro, kecil, dan menengah yang dibina Posyantek
          melalui penerapan teknologi tepat guna untuk meningkatkan kualitas dan daya saing produk.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 animate-fade-up delay-100">
        {[
          {
            icon: Sparkles,
            title: 'Produk Berkualitas TTG',
            desc: 'Setiap produk dihasilkan menggunakan teknologi tepat guna yang meningkatkan kualitas dan efisiensi produksi.',
            color: 'bg-amber-50 border-t-4 border-amber-400',
            iconBg: 'text-amber-600',
          },
          {
            icon: TrendingUp,
            title: 'Pemberdayaan Ekonomi',
            desc: 'Membantu UMKM lokal berkembang melalui pendampingan, pelatihan, dan akses pasar yang lebih luas.',
            color: 'bg-green-50 border-t-4 border-green-400',
            iconBg: 'text-green-600',
          },
          {
            icon: Users,
            title: 'Komunitas Pengrajin',
            desc: 'Menghubungkan pelaku usaha dengan komunitas dan mitra untuk berbagi pengetahuan dan peluang.',
            color: 'bg-blue-50 border-t-4 border-blue-400',
            iconBg: 'text-blue-600',
          },
        ].map((c) => (
          <div key={c.title} className={`${c.color} rounded-2xl p-6 card-hover`}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <c.icon size={22} className={c.iconBg} />
            </div>
            <h3 className="font-black text-gray-800 mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Category Tags */}
      {allCategories.length > 0 && (
        <div className="mb-8 animate-fade-up delay-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Kategori Produk</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/umkm"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 text-white shadow-sm"
            >
              Semua
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="animate-fade-up delay-200">
        {allProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Store size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">Belum Ada Produk UMKM</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Produk UMKM binaan Posyantek akan ditampilkan di sini. Hubungi kami untuk informasi lebih lanjut.
            </p>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm btn-press"
            >
              Hubungi Kami <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">{allProducts.length} produk UMKM binaan</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
              >
                Lihat di Toko Online <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="mt-14 bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-8 text-white text-center animate-fade-up">
        <ShoppingBag size={36} className="mx-auto mb-4 opacity-70" />
        <h2 className="text-2xl font-black mb-3">Tertarik Menjual Produk UMKM Anda?</h2>
        <p className="text-green-100/80 max-w-lg mx-auto mb-6">
          Posyantek membantu UMKM lokal untuk memasarkan produknya melalui platform digital.
          Bergabunglah dan jangkau pasar yang lebih luas!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all btn-press"
          >
            Pelajari Layanan Kami <ArrowRight size={16} />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg btn-press"
          >
            Kunjungi Toko <ShoppingBag size={16} />
          </Link>
        </div>
      </div>

    </div>
  )
}
