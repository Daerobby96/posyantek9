'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'
import { Trash2, Plus, Tag } from 'lucide-react'

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const slugify = (t: string) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('categories').insert({
      name: name.trim(),
      slug: slugify(name.trim()),
    })
    if (error) setError('Gagal menambahkan. Nama mungkin sudah ada.')
    else { setName(''); router.refresh() }
    setLoading(false)
  }

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return
    await supabase.from('categories').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {/* Add form */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-green-400" /> Tambah Kategori Baru
        </h2>
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kategori (mis: Anyaman, Batik...)"
            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? '...' : 'Tambah'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Tag size={15} className="text-gray-400" />
            Daftar Kategori
          </h2>
          <span className="text-xs text-gray-500 bg-gray-700 px-2.5 py-1 rounded-full font-semibold">
            {categories.length}
          </span>
        </div>
        {categories.length === 0 ? (
          <div className="py-12 text-center text-gray-600 text-sm">
            Belum ada kategori
          </div>
        ) : (
          <ul className="divide-y divide-gray-700/50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-700/30 transition-colors">
                <div>
                  <p className="font-semibold text-white text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all"
                  title="Hapus kategori"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
