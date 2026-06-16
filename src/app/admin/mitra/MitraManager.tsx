'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, ExternalLink, Handshake } from 'lucide-react'

interface MitraItem {
  id: string
  name: string
  jenis: string
  website: string | null
  logo_url: string | null
  created_at: string
}

const JENIS_OPTIONS = [
  'Pemerintah', 'Perguruan Tinggi', 'Lembaga Penelitian',
  'Swasta / Perusahaan', 'LSM / NGO', 'Perbankan', 'Lainnya',
]

const JENIS_COLOR: Record<string, string> = {
  'Pemerintah':        'bg-blue-900/40 text-blue-300 border-blue-800',
  'Perguruan Tinggi':  'bg-purple-900/40 text-purple-300 border-purple-800',
  'Lembaga Penelitian':'bg-teal-900/40 text-teal-300 border-teal-800',
  'Swasta / Perusahaan':'bg-amber-900/40 text-amber-300 border-amber-800',
  'LSM / NGO':         'bg-green-900/40 text-green-300 border-green-800',
  'Perbankan':         'bg-rose-900/40 text-rose-300 border-rose-800',
}

const field = 'w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'

export default function MitraManager({ items }: { items: MitraItem[] }) {
  const [form, setForm]     = useState({ name: '', jenis: 'Pemerintah', website: '', logo_url: '' })
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const router  = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.from('mitra').insert({
      name:     form.name,
      jenis:    form.jenis,
      website:  form.website  || null,
      logo_url: form.logo_url || null,
    })
    if (error) { setError('Gagal menyimpan.'); setLoading(false); return }
    setForm({ name: '', jenis: 'Pemerintah', website: '', logo_url: '' })
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus mitra "${name}"?`)) return
    await supabase.from('mitra').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {/* Add form */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-700/30 transition-colors"
        >
          <span className="flex items-center gap-2 text-white font-bold">
            <Plus size={16} className="text-green-400" /> Tambah Mitra Baru
          </span>
          <span className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {open && (
          <div className="px-5 pb-5 border-t border-gray-700 pt-4">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Nama Instansi <span className="text-red-400">*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Nama instansi/lembaga" className={field} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Jenis Mitra</label>
                  <select name="jenis" value={form.jenis} onChange={handleChange} className={`${field} bg-gray-900`}>
                    {JENIS_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Website</label>
                  <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://contoh.go.id" className={field} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">URL Logo</label>
                  <input type="url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://contoh.go.id/logo.png" className={field} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 border border-gray-600 text-gray-300 hover:text-white rounded-xl font-semibold text-sm transition-colors">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  {loading ? 'Menyimpan...' : 'Tambah Mitra'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mitra list */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Handshake size={15} className="text-gray-400" /> Daftar Mitra
          </h2>
          <span className="text-xs text-gray-500 bg-gray-700 px-2.5 py-1 rounded-full font-semibold">{items.length}</span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-600 text-sm">Belum ada mitra terdaftar</div>
        ) : (
          <ul className="divide-y divide-gray-700/50">
            {items.map((mitra) => (
              <li key={mitra.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-700/30 transition-colors">
                {/* Logo */}
                <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                  {mitra.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mitra.logo_url} alt={mitra.name} className="w-8 h-8 object-contain rounded-lg" />
                  ) : (
                    <Handshake size={18} className="text-gray-500" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{mitra.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${JENIS_COLOR[mitra.jenis] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                    {mitra.jenis}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {mitra.website && (
                    <a href={mitra.website} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-xl transition-all" title="Buka website">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(mitra.id, mitra.name)}
                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all" title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
