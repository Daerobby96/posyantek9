import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '../ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Produk' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Edit Produk</h1>
        <p className="text-gray-500 text-sm mt-1 truncate">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
