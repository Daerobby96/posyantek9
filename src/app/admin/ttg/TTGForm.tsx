'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TTG } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

const field = 'w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
const lbl   = 'block text-sm font-semibold text-gray-300 mb-1.5'

const BIDANG_OPTIONS = [
  { value: 'pertanian',         label: 'Pertanian' },
  { value: 'perikanan',         label: 'Perikanan' },
  { value: 'energi',            label: 'Energi Terbarukan' },
  { value: 'lingkungan',        label: 'Lingkungan' },
  { value: 'industri-rumahan',  label: 'Industri Rumahan' },
  { value: 'kesehatan',         label: 'Kesehatan' },
  { value: 'lainnya',           label: 'Lainnya' },
]

export default function TTGForm({ ttg }: { ttg?: TTG }) {
  const [form, setForm] = useState({
    name:        ttg?.name        || '',
    description: ttg?.description || '',
    bidang:      ttg?.bidang      || 'pertanian',
    image_url:   ttg?.image_url   || '',
    cara_kerja:  ttg?.cara_kerja  || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      name:        form.name,
      description: form.description || null,
      bidang:      form.bidang,
      image_url:   form.image_url || null,
      cara_kerja:  form.cara_kerja || null,
    }
    if (ttg) {
      const { error } = await supabase.from('ttg').update(payload).eq('id', ttg.id)
      if (error) { setError('Gagal menyimpan: ' + error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('ttg').insert(payload)
      if (error) { setError('Gagal menyimpan: ' + error.message); setLoading(false); return }
    }
    router.push('/admin/ttg')
    router.refresh()
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={lbl}>Nama TTG <span className="text-red-400">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="cth: Pompa Hidram, Biodigester..." className={field} />
        </div>

        <div>
          <label className={lbl}>Bidang <span className="text-red-400">*</span></label>
          <select name="bidang" value={form.bidang} onChange={handleChange} className={`${field} bg-gray-900`}>
            {BIDANG_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={lbl}>URL Gambar</label>
          <input type="url" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://contoh.com/gambar.jpg" className={field} />
        </div>

        <div>
          <label className={lbl}>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Deskripsi singkat tentang teknologi ini..." className={`${field} resize-none`} />
        </div>

        <div>
          <label className={lbl}>Cara Kerja</label>
          <textarea name="cara_kerja" value={form.cara_kerja} onChange={handleChange} rows={4} placeholder="Jelaskan prinsip dan cara kerja teknologi ini..." className={`${field} resize-y`} />
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-700">
          <button type="button" onClick={() => router.back()} className="flex items-center gap-2 px-5 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-semibold rounded-xl transition-colors text-sm">
            <ArrowLeft size={15} /> Batal
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            {loading ? 'Menyimpan...' : ttg ? 'Simpan Perubahan' : 'Tambah TTG'}
          </button>
        </div>
      </form>
    </div>
  )
}
