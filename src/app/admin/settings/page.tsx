import { createClient } from '@/lib/supabase/server'
import { Settings, Shield, Bell, Globe, Database } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pengaturan' }

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const sections = [
    {
      icon: Shield,
      title: 'Akun & Keamanan',
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      items: [
        { label: 'Email', value: user?.email || '—', editable: false },
        { label: 'Role', value: profile?.role || '—', editable: false },
        { label: 'Nama Lengkap', value: profile?.full_name || '—', editable: true },
      ],
    },
    {
      icon: Globe,
      title: 'Informasi Website',
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      items: [
        { label: 'Nama Lembaga', value: 'Posyantek Kecamatan Contoh', editable: true },
        { label: 'Kecamatan', value: 'Kecamatan Contoh', editable: true },
        { label: 'Kabupaten', value: 'Kabupaten Contoh', editable: true },
        { label: 'Telepon', value: '(021) 1234-5678', editable: true },
        { label: 'Email Lembaga', value: 'info@posyantek.id', editable: true },
      ],
    },
  ]

  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi sistem dan informasi lembaga</p>
      </div>

      {/* Info cards */}
      {sections.map((sec) => (
        <div key={sec.title} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3">
            <div className={`w-8 h-8 ${sec.bg} rounded-xl flex items-center justify-center`}>
              <sec.icon size={16} className={sec.color} />
            </div>
            <h2 className="text-white font-bold">{sec.title}</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {sec.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{item.label}</p>
                  <p className="text-gray-200 text-sm mt-0.5">{item.value}</p>
                </div>
                {item.editable && (
                  <span className="text-xs text-gray-600 bg-gray-700 px-2.5 py-1 rounded-lg font-medium">
                    Edit di Supabase
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Database & Schema */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-900/20 rounded-xl flex items-center justify-center">
            <Database size={16} className="text-purple-400" />
          </div>
          <h2 className="text-white font-bold">Database</h2>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-gray-400 text-sm">Tabel yang digunakan oleh sistem:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['profiles', 'products', 'categories', 'orders', 'order_items', 'posts', 'ttg', 'gallery_items', 'mitra'].map((t) => (
              <div key={t} className="flex items-center gap-2 bg-gray-700/50 rounded-xl px-3 py-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                <span className="text-gray-300 text-xs font-mono">{t}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Jalankan <code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">supabase-schema.sql</code> dan{' '}
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">supabase-fix-rls.sql</code> di Supabase SQL Editor untuk setup lengkap.
          </p>
        </div>
      </div>

      {/* Notifikasi placeholder */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-900/20 rounded-xl flex items-center justify-center">
            <Bell size={16} className="text-amber-400" />
          </div>
          <h2 className="text-white font-bold">Notifikasi</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-gray-200 text-sm font-medium">Pesanan baru masuk</p>
              <p className="text-gray-500 text-xs">Notifikasi saat ada pesanan baru</p>
            </div>
            <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
