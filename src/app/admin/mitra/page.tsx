import { createClient } from '@/lib/supabase/server'
import { Handshake } from 'lucide-react'
import MitraManager from './MitraManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mitra' }

export default async function AdminMitraPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('mitra')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-black text-white">Mitra & Kerja Sama</h1>
        <p className="text-gray-500 text-sm mt-1">{(items || []).length} mitra terdaftar</p>
      </div>
      <MitraManager items={items || []} />
    </div>
  )
}
