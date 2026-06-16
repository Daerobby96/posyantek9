import { createClient } from '@/lib/supabase/server'
import ProductForm from '../ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tambah Produk' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Tambah Produk</h1>
        <p className="text-gray-500 text-sm mt-1">Isi data produk baru untuk ditampilkan di toko</p>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  )
}
