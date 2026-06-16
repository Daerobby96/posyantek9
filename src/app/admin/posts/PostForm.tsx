'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

const field = 'w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
const lbl   = 'block text-sm font-semibold text-gray-300 mb-1.5'

export default function PostForm({ post }: { post?: Post }) {
  const slugify = (t: string) =>
    t.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 80)

  const [form, setForm] = useState({
    title:     post?.title     || '',
    slug:      post?.slug      || '',
    excerpt:   post?.excerpt   || '',
    content:   post?.content   || '',
    cover_url: post?.cover_url || '',
    category:  post?.category  || 'berita',
    published: post?.published ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm((f) => ({
      ...f,
      [name]: val,
      ...(name === 'title' && !post ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      title:     form.title,
      slug:      form.slug || slugify(form.title),
      excerpt:   form.excerpt || null,
      content:   form.content,
      cover_url: form.cover_url || null,
      category:  form.category,
      published: form.published,
    }

    if (post) {
      const { error } = await supabase.from('posts').update(payload).eq('id', post.id)
      if (error) { setError('Gagal menyimpan: ' + error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('posts').insert(payload)
      if (error) { setError('Gagal menyimpan: ' + error.message); setLoading(false); return }
    }
    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={lbl}>Judul <span className="text-red-400">*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Judul artikel" className={field} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Slug (URL)</label>
            <input type="text" name="slug" value={form.slug} onChange={handleChange} placeholder="judul-artikel" className={field} />
            <p className="text-xs text-gray-600 mt-1">Otomatis dari judul. Ubah jika perlu.</p>
          </div>
          <div>
            <label className={lbl}>Kategori</label>
            <select name="category" value={form.category} onChange={handleChange} className={`${field} bg-gray-900`}>
              <option value="berita">Berita</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="pengumuman">Pengumuman</option>
            </select>
          </div>
        </div>

        <div>
          <label className={lbl}>URL Gambar Cover</label>
          <input type="url" name="cover_url" value={form.cover_url} onChange={handleChange} placeholder="https://contoh.com/gambar.jpg" className={field} />
        </div>

        <div>
          <label className={lbl}>Ringkasan / Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Ringkasan singkat artikel..." className={`${field} resize-none`} />
        </div>

        <div>
          <label className={lbl}>Konten <span className="text-red-400">*</span></label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={12} placeholder="Tulis konten artikel di sini..." className={`${field} resize-y`} />
        </div>

        <div className="flex items-center gap-3 py-1">
          <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-green-500" />
          <label htmlFor="published" className="text-sm font-semibold text-gray-300 cursor-pointer">
            Publikasikan artikel <span className="text-gray-500 font-normal">(tampil di website)</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-700">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-semibold rounded-xl transition-colors text-sm">
            <ArrowLeft size={15} /> Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            {loading ? 'Menyimpan...' : post ? 'Simpan Perubahan' : 'Publikasikan'}
          </button>
        </div>
      </form>
    </div>
  )
}
