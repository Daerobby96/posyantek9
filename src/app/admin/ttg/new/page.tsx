import TTGForm from '../TTGForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tambah TTG' }

export default function NewTTGPage() {
  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Tambah Katalog TTG</h1>
        <p className="text-gray-500 text-sm mt-1">Daftarkan teknologi tepat guna baru</p>
      </div>
      <TTGForm />
    </div>
  )
}
