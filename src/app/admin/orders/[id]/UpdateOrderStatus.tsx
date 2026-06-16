'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Menunggu Konfirmasi', color: 'text-yellow-400' },
  { value: 'processing', label: 'Diproses',            color: 'text-blue-400' },
  { value: 'shipped',    label: 'Dikirim',             color: 'text-purple-400' },
  { value: 'delivered',  label: 'Selesai / Diterima',  color: 'text-green-400' },
  { value: 'cancelled',  label: 'Dibatalkan',          color: 'text-red-400' },
]

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setLoading(true)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-2.5">
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); setSaved(false) }}
        className="w-full text-sm px-3 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? 'bg-green-700 text-white'
            : status === currentStatus
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memperbarui...
          </span>
        ) : saved ? (
          <><CheckCircle2 size={14} /> Tersimpan</>
        ) : (
          'Simpan Status'
        )}
      </button>
    </div>
  )
}
