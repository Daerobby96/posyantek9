'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Link as LinkIcon } from 'lucide-react'

const field = 'w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

export default function AddGalleryForm() {
  const [form, setForm] = useState({ title: '', url: '', type: 'photo' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.from('gallery_items').insert({
      title: form.title,
      url:   form.url,
      type:  form.type,
    })
    if (error) { setError('Gagal menambahkan: ' + error.message); setLoading(false); return }
    setForm({ title: '', url: '', type: 'photo' })
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-700/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-white font-bold">
          <Plus size={16} className="text-green-400" /> Tambah Foto / Video
        </span>
        <span className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-700 pt-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Judul <span className="text-red-400">*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Judul foto/video" className={field} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Tipe</label>
                <select name="type" value={form.type} onChange={handleChange} className={`${field} bg-gray-900`}>
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5"><LinkIcon size={12} /> URL {form.type === 'video' ? 'Video (YouTube embed)' : 'Gambar'} <span className="text-red-400">*</span></span>
              </label>
              <input type="url" name="url" value={form.url} onChange={handleChange} required placeholder={form.type === 'video' ? 'https://youtube.com/embed/...' : 'https://contoh.com/foto.jpg'} className={field} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-sm transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                {loading ? 'Menyimpan...' : 'Tambah ke Galeri'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
