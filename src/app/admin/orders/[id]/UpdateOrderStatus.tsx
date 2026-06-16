'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, AlertCircle } from 'lucide-react'

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
  const [error, setError] = useState('')
  const router = useRouter()

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    // Verify admin role first
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Sesi habis. Silakan login ulang.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      setError('Anda tidak memiliki hak akses admin.')
      setLoading(false)
      return
    }

    // Update the order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    setLoading(false)

    if (updateError) {
      console.error('Update order status error:', updateError)
      setError(`Gagal mengubah status: ${updateError.message}`)
      return
    }

    setSaved(true)
    setTimeout(() => { setSaved(false); router.refresh() }, 1500)
  }

  return (
    <div className="space-y-2.5">
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); setSaved(false); setError('') }}
        className="w-full text-sm px-3 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {error && (
        <div className="flex items-start gap-2 text-red-400 text-xs bg-red-900/30 border border-red-800 rounded-xl px-3 py-2.5">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

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
