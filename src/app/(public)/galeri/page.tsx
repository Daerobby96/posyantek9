import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { GalleryItem } from '@/lib/types'
import { Images, Play, Calendar, SearchX } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Galeri' }

export default async function GaleriPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  const allItems = (items as GalleryItem[]) || []
  const photos = allItems.filter((i) => i.type === 'photo')
  const videos = allItems.filter((i) => i.type === 'video')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
            <Images size={20} className="text-rose-600" />
          </div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Dokumentasi</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Galeri Posyantek</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Dokumentasi kegiatan, pelatihan, pameran, dan momen penting Posyantek
          dalam melayani masyarakat melalui teknologi tepat guna.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 animate-fade-up delay-100">
        {[
          { label: 'Total Media', value: allItems.length, icon: Images, color: 'bg-green-50 text-green-700' },
          { label: 'Foto', value: photos.length, icon: Images, color: 'bg-blue-50 text-blue-700' },
          { label: 'Video', value: videos.length, icon: Play, color: 'bg-purple-50 text-purple-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Grid */}
      {allItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 animate-fade-up">
          <Images size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Belum Ada Media</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Dokumentasi kegiatan dan foto/video Posyantek akan ditampilkan di sini.
          </p>
        </div>
      ) : (
        <>
          {/* Photos Section */}
          {photos.length > 0 && (
            <div className="mb-12 animate-fade-up delay-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Images size={16} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Foto</h2>
                <span className="text-xs text-gray-400 font-medium">{photos.length} foto</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((item, i) => (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm animate-fade-up delay-${(i % 4) * 100}`}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <div className="p-3.5">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="animate-fade-up delay-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Play size={16} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Video</h2>
                <span className="text-xs text-gray-400 font-medium">{videos.length} video</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((item, i) => (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm animate-fade-up delay-${(i % 3) * 100}`}
                  >
                    <div className="relative h-52 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-purple-600 ml-1" />
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-bold text-gray-800 line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  )
}
