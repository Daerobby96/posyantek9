import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TTG } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Plus, Cpu } from 'lucide-react'
import DeleteTTGButton from './DeleteTTGButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Katalog TTG' }

const BIDANG_COLOR: Record<string, string> = {
  pertanian:        'bg-green-900/40 text-green-300 border-green-800',
  perikanan:        'bg-blue-900/40 text-blue-300 border-blue-800',
  energi:           'bg-amber-900/40 text-amber-300 border-amber-800',
  lingkungan:       'bg-teal-900/40 text-teal-300 border-teal-800',
  'industri-rumahan': 'bg-purple-900/40 text-purple-300 border-purple-800',
  kesehatan:        'bg-rose-900/40 text-rose-300 border-rose-800',
}

export default async function AdminTTGPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('ttg')
    .select('*')
    .order('created_at', { ascending: false })

  const all = (items as TTG[]) || []

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Katalog TTG</h1>
          <p className="text-gray-500 text-sm mt-1">{all.length} teknologi terdaftar</p>
        </div>
        <Link
          href="/admin/ttg/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-green-900/30"
        >
          <Plus size={16} /> Tambah TTG
        </Link>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
          <Cpu size={36} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 mb-2">Belum ada TTG terdaftar</p>
          <Link href="/admin/ttg/new" className="text-green-400 hover:text-green-300 text-sm font-semibold">
            + Tambah TTG pertama
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {['Nama TTG', 'Bidang', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {all.map((ttg) => (
                  <tr key={ttg.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold text-sm">{ttg.name}</p>
                      {ttg.description && (
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{ttg.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${BIDANG_COLOR[ttg.bidang] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                        {ttg.bidang.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(ttg.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/ttg/${ttg.id}`} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-900/30 transition-colors">
                          Edit
                        </Link>
                        <DeleteTTGButton ttgId={ttg.id} ttgName={ttg.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
