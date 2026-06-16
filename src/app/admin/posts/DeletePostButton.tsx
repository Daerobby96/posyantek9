'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handle = async () => {
    if (!confirm(`Hapus artikel "${postTitle}"?`)) return
    await supabase.from('posts').delete().eq('id', postId)
    router.refresh()
  }

  return (
    <button onClick={handle} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-900/30 transition-colors">
      Hapus
    </button>
  )
}
