'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`Hapus produk "${productName}"?\nTindakan ini tidak bisa dibatalkan.`)) return
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-900/30 transition-colors"
    >
      Hapus
    </button>
  )
}
