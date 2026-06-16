'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Category, Product } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

interface Props {
  product?: Product
  categories: Category[]
}

const field = 'w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
const label = 'block text-sm font-semibold text-gray-300 mb-1.5'

export default function ProductForm({ product, categories }: Props) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '',
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    is_active: product?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      is_active: form.is_active,
    }
    if (product) {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id)
      if (error) { setError('Gagal mengupdate produk.'); setLoading(false); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { setError('Gagal menambahkan produk.'); setLoading(false); return }
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={label}>Nama Produk <span className="text-red-400">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Nama produk" className={field} />
        </div>

        <div>
          <label className={label}>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Deskripsi produk..." className={`${field} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Harga (Rp) <span className="text-red-400">*</span></label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="50000" className={field} />
          </div>
          <div>
            <label className={label}>Stok <span className="text-red-400">*</span></label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" placeholder="10" className={field} />
          </div>
        </div>

        <div>
          <label className={label}>URL Gambar</label>
          <input type="url" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://contoh.com/gambar.jpg" className={field} />
          <p className="text-xs text-gray-600 mt-1">Masukkan URL gambar produk</p>
        </div>

        <div>
          <label className={label}>Kategori</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className={`${field} bg-gray-900`}>
            <option value="">-- Tanpa Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 py-1">
          <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-green-500 rounded" />
          <label htmlFor="is_active" className="text-sm font-semibold text-gray-300 cursor-pointer">
            Produk aktif <span className="text-gray-500 font-normal">(tampil di toko)</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-700">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-semibold rounded-xl transition-colors text-sm">
            <ArrowLeft size={15} /> Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            {loading ? 'Menyimpan...' : product ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </div>
      </form>
    </div>
  )
}
