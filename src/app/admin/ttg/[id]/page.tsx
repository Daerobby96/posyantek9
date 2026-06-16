import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TTGForm from '../TTGForm'
import { TTG } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit TTG' }

export default async function EditTTGPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('ttg').select('*').eq('id', id).single()
  if (!data) notFound()
  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Edit TTG</h1>
        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{data.name}</p>
      </div>
      <TTGForm ttg={data as TTG} />
    </div>
  )
}
