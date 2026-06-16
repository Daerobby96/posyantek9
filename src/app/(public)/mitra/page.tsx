import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Mitra } from '@/lib/types'
import { Handshake, ExternalLink, Building2, GraduationCap, FlaskConical, Briefcase, Globe, Landmark, SearchX } from 'lucide-react'

export const metadata: Metadata = { title: 'Mitra & Kerja Sama' }

const JENIS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Pemerintah':         { icon: Building2,    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  'Perguruan Tinggi':   { icon: GraduationCap, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  'Lembaga Penelitian': { icon: FlaskConical,  color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200' },
  'Swasta / Perusahaan':{ icon: Briefcase,    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  'LSM / NGO':          { icon: Globe,        color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  'Perbankan':          { icon: Landmark,      color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200' },
  'Lainnya':            { icon: Handshake,     color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
}

function getJenisConfig(jenis: string) {
  return JENIS_CONFIG[jenis] || JENIS_CONFIG['Lainnya']
}

export default async function MitraPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('mitra')
    .select('*')
    .order('created_at', { ascending: false })

  const allMitra = (items as Mitra[]) || []

  // Group by jenis
  const grouped = allMitra.reduce<Record<string, Mitra[]>>((acc, m) => {
    const key = m.jenis || 'Lainnya'
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
            <Handshake size={20} className="text-teal-600" />
          </div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Kemitraan</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Mitra & Kerja Sama</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Posyantek bekerja sama dengan berbagai instansi pemerintah, perguruan tinggi,
          lembaga penelitian, dan dunia usaha untuk mengembangkan teknologi tepat guna
          dan memberdayakan masyarakat.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 animate-fade-up delay-100">
        {[
          { label: 'Total Mitra', value: allMitra.length, color: 'text-green-700 bg-green-50' },
          ...Object.entries(grouped).slice(0, 3).map(([jenis, list]) => ({
            label: jenis,
            value: list.length,
            color: getJenisConfig(jenis).bg,
          })),
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mitra List */}
      {allMitra.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 animate-fade-up">
          <Handshake size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Belum Ada Mitra</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Daftar mitra kerja sama Posyantek akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <>
          {/* All Mitra in Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up delay-200">
            {allMitra.map((mitra, i) => {
              const config = getJenisConfig(mitra.jenis)
              const IconComp = config.icon
              return (
                <div
                  key={mitra.id}
                  className={`bg-white rounded-2xl border border-gray-100 p-6 card-hover shadow-sm animate-fade-up delay-${(i % 3) * 100}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className={`w-14 h-14 ${config.bg} border rounded-2xl flex items-center justify-center shrink-0`}>
                      {mitra.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={mitra.logo_url} alt={mitra.name} className="w-9 h-9 object-contain" />
                      ) : (
                        <IconComp size={24} className={config.color} />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">{mitra.name}</h3>
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${config.bg} ${config.color} border`}>
                        {mitra.jenis}
                      </span>
                    </div>
                  </div>
                  {/* Website Link */}
                  {mitra.website && (
                    <div className="mt-4 pt-3 border-t border-gray-50">
                      <a
                        href={mitra.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Kunjungi Website
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grouped View */}
          {Object.keys(grouped).length > 1 && (
            <div className="mt-14 animate-fade-up">
              <h2 className="text-xl font-black text-gray-900 mb-6">Berdasarkan Jenis Mitra</h2>
              <div className="space-y-8">
                {Object.entries(grouped).map(([jenis, list]) => {
                  const config = getJenisConfig(jenis)
                  const IconComp = config.icon
                  return (
                    <div key={jenis}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className={`w-8 h-8 ${config.bg} border rounded-lg flex items-center justify-center`}>
                          <IconComp size={14} className={config.color} />
                        </div>
                        <h3 className="font-bold text-gray-800">{jenis}</h3>
                        <span className="text-xs text-gray-400 font-medium">({list.length})</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {list.map((m) => (
                          <div
                            key={m.id}
                            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 card-hover shadow-sm"
                          >
                            <div className={`w-10 h-10 ${config.bg} border rounded-xl flex items-center justify-center shrink-0`}>
                              {m.logo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={m.logo_url} alt={m.name} className="w-6 h-6 object-contain" />
                              ) : (
                                <IconComp size={16} className={config.color} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-1">{m.name}</p>
                              {m.website && (
                                <a
                                  href={m.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-green-600 hover:text-green-700 font-medium flex items-center gap-0.5 mt-0.5"
                                >
                                  Website <ExternalLink size={8} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  )
}
