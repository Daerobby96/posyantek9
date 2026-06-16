import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatRupiah } from '@/lib/utils'
import { Plus } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Produk' }

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .order('created_at', { ascending: false })

  const allProducts = (products as Product[]) || []

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Produk</h1>
          <p className="text-gray-500 text-sm mt-1">{allProducts.length} produk terdaftar</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-green-900/30"
        >
          <Plus size={16} />
          Tambah Produk
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700 border-dashed">
          <p className="text-gray-500 mb-3">Belum ada produk</p>
          <Link href="/admin/products/new" className="text-green-400 font-semibold hover:text-green-300 text-sm transition-colors">
            + Tambah produk pertama
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-700 shrink-0">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🧶</div>
                          )}
                        </div>
                        <span className="font-medium text-white text-sm line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{product.category?.name || '—'}</td>
                    <td className="px-5 py-4 font-semibold text-white text-sm">{formatRupiah(product.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold text-sm ${product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-gray-300'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        product.is_active
                          ? 'bg-green-900/40 text-green-400 border-green-800'
                          : 'bg-gray-700 text-gray-500 border-gray-600'
                      }`}>
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-900/30 transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
