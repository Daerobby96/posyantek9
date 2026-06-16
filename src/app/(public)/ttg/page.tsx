import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Cpu, Filter } from 'lucide-react'
import { TTG } from '@/lib/types'

export const metadata: Metadata = { title: 'Katalog TTG' }


const BIDANG = [
  { value: '', label: 'Semua Bidang' },
  { value: 'pertanian', label: 'Pertanian' },
  { value: 'perikanan', label: 'Perikanan' },
  { value: 'energi', label: 'Energi Terbarukan' },
  { value: 'lingkungan', label: 'Lingkungan' },
  { value: 'industri-rumahan', label: 'Industri Rumahan' },
  { value: 'kesehatan', label: 'Kesehatan' },
]

const BIDANG_COLOR: Record<string, string> = {
  pertanian: 'bg-green-100 text-green-700',
  perikanan: 'bg-blue-100 text-blue-700',
  energi: 'bg-amber-100 text-amber-700',
  lingkungan: 'bg-teal-100 text-teal-700',
  'industri-rumahan': 'bg-purple-100 text-purple-700',
  kesehatan: 'bg-rose-100 text-rose-700',
}

export default async function TTGPage({
  searchParams,
}: {
  searchParams: Promise<{ bidang?: string; q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('ttg').select('*').order('created_at', { ascending: false })
  if (params.bidang) query = query.eq('bidang', params.bidang)
  if (params.q) query = query.ilike('name', `%${params.q}%`)

  const { data: dbData } = await query
  const items = (dbData || []) as Partial<TTG>[]

  const filtered = items.filter((t) => {
    const matchBidang = !params.bidang || t.bidang === params.bidang
    const matchQ = !params.q || t.name?.toLowerCase().includes(params.q.toLowerCase())
    return matchBidang && matchQ
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Cpu size={20} className="text-blue-600" />
          </div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Posyantek</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Katalog Teknologi Tepat Guna</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Inventarisasi berbagai jenis TTG yang telah digunakan dan tersedia untuk masyarakat.
          Setiap teknologi dilengkapi deskripsi, foto, dan cara kerja.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0 animate-fade-up delay-100">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 shadow-sm">
            {/* Search */}
            <form method="get" action="/ttg" className="mb-5">
              {params.bidang && <input type="hidden" name="bidang" value={params.bidang} />}
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q || ''}
                  placeholder="Cari TTG..."
                  className="w-full text-sm pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                />
                <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bidang</p>
            <ul className="space-y-1">
              {BIDANG.map((b) => (
                <li key={b.value}>
                  <a
                    href={`/ttg${b.value ? `?bidang=${b.value}` : ''}${params.q ? `${b.value ? '&' : '?'}q=${params.q}` : ''}`}
                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                      (params.bidang || '') === b.value
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {b.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 animate-fade-up delay-200">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} TTG ditemukan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((ttg, i) => (
              <div
                key={ttg.id}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm animate-fade-up delay-${(i % 4) * 100}`}
              >
                {/* Image */}
                <div className="h-44 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                  {ttg.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ttg.image_url} alt={ttg.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Cpu size={40} className="text-blue-200 mx-auto mb-2" />
                      <span className="text-xs text-blue-300">Foto belum tersedia</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{ttg.name}</h3>
                    {ttg.bidang && (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${BIDANG_COLOR[ttg.bidang] || 'bg-gray-100 text-gray-600'}`}>
                        {ttg.bidang.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{ttg.description}</p>

                  {ttg.cara_kerja && (
                    <details className="group">
                      <summary className="text-xs font-semibold text-blue-600 cursor-pointer hover:text-blue-700 flex items-center gap-1 list-none">
                        <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                        Cara Kerja
                      </summary>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed pl-4 border-l-2 border-blue-100">
                        {ttg.cara_kerja}
                      </p>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
