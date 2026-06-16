'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteGalleryButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm(`Hapus "${itemTitle}"?`)) return
    await supabase.from('gallery_items').delete().eq('id', itemId)
    router.refresh()
  }

  return (
    <button
      onClick={handle}
      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-xl transition-colors shadow-lg"
      title="Hapus"
    >
      <Trash2 size={16} />
    </button>
  )
}
