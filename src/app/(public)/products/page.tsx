import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import { Product, Category } from '@/lib/types'
import { SlidersHorizontal, SearchX } from 'lucide-react'

interface SearchParams {
  category?: string
  q?: string
  sort?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)

  if (params.category) query = query.eq('category_id', params.category)
  if (params.q) query = query.ilike('name', `%${params.q}%`)

  // Sort
  if (params.sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (params.sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  const allProducts = (products as Product[]) || []
  const allCategories = (categories as Category[]) || []
  const selectedCat = allCategories.find((c) => c.id === params.category)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="mb-8 animate-fade-up">
        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Katalog</span>
        <h1 className="text-3xl font-black text-gray-900 mt-1">
          {selectedCat ? selectedCat.name : params.q ? `Hasil: "${params.q}"` : 'Semua Produk'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {allProducts.length} produk ditemukan
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="md:w-60 shrink-0 animate-fade-up delay-100">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 shadow-sm">

            {/* Search */}
            <form method="get" action="/products" className="mb-5">
              {params.category && (
                <input type="hidden" name="category" value={params.category} />
              )}
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Cari produk..."
                  className="w-full text-sm pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
            </form>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <SlidersHorizontal size={11} /> Urutkan
              </p>
              <div className="space-y-1">
                {[
                  { value: '', label: 'Terbaru' },
                  { value: 'price_asc', label: 'Harga: Rendah ke Tinggi' },
                  { value: 'price_desc', label: 'Harga: Tinggi ke Rendah' },
                ].map((opt) => (
                  <a
                    key={opt.value}
                    href={`/products?${params.category ? `category=${params.category}&` : ''}${params.q ? `q=${params.q}&` : ''}sort=${opt.value}`}
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                      (params.sort || '') === opt.value
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategori</p>
              <ul className="space-y-1">
                <li>
                  <a
                    href={params.q ? `/products?q=${params.q}` : '/products'}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                      !params.category
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Semua Produk
                  </a>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/products?category=${cat.id}${params.q ? `&q=${params.q}` : ''}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        params.category === cat.id
                          ? 'bg-green-50 text-green-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear filters */}
            {(params.category || params.q || params.sort) && (
              <a
                href="/products"
                className="mt-5 w-full block text-center text-xs font-semibold text-red-500 hover:text-red-700 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                ✕ Hapus Semua Filter
              </a>
            )}
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 animate-fade-up delay-200">
          {allProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <SearchX size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-600">Produk Tidak Ditemukan</p>
              <p className="text-sm text-gray-400 mt-1 mb-5">Coba kata kunci atau kategori lain</p>
              <a href="/products" className="text-sm text-green-700 font-semibold hover:underline">
                Lihat semua produk →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
