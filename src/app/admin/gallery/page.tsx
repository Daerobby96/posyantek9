import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Images } from 'lucide-react'
import AddGalleryForm from './AddGalleryForm'
import DeleteGalleryButton from './DeleteGalleryButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Galeri' }

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  const all = items || []

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-black text-white">Galeri</h1>
        <p className="text-gray-500 text-sm mt-1">{all.length} item media</p>
      </div>

      {/* Upload form */}
      <AddGalleryForm />

      {/* Grid */}
      {all.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
          <Images size={36} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500">Belum ada foto/video di galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {all.map((item) => (
            <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden group">
              <div className="relative h-40 bg-gray-700">
                {item.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">▶️</span>
                    <span className="text-xs text-gray-400">Video</span>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <DeleteGalleryButton itemId={item.id} itemTitle={item.title} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">{formatDate(item.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
