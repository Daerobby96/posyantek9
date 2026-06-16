import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/types'
import CategoryManager from './CategoryManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kategori' }

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Kategori Produk</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola kategori untuk pengelompokan produk</p>
      </div>
      <CategoryManager categories={(categories as Category[]) || []} />
    </div>
  )
}
