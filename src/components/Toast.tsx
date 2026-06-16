'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

let toastFn: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null

export function toast(msg: Omit<ToastMessage, 'id'>) {
  toastFn?.(msg)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev.slice(-3), { ...msg, id }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  useEffect(() => {
    toastFn = addToast
    return () => { toastFn = null }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-enter pointer-events-auto flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 min-w-[260px] max-w-xs"
        >
          {t.type === 'success' && <CheckCircle2 size={18} className="text-green-600 shrink-0" />}
          {t.type === 'error' && <XCircle size={18} className="text-red-500 shrink-0" />}
          {t.type === 'info' && <Info size={18} className="text-blue-500 shrink-0" />}
          <p className="text-sm font-medium text-gray-800 flex-1">{t.message}</p>
          <button
            onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
