'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteTTGButton({ ttgId, ttgName }: { ttgId: string; ttgName: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handle = async () => {
    if (!confirm(`Hapus TTG "${ttgName}"?`)) return
    await supabase.from('ttg').delete().eq('id', ttgId)
    router.refresh()
  }

  return (
    <button onClick={handle} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-900/30 transition-colors">
      Hapus
    </button>
  )
}
