import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Newspaper, Tag } from 'lucide-react'

export const metadata: Metadata = { title: 'Berita & Kegiatan' }


const CAT_COLOR: Record<string, string> = {
  berita: 'bg-blue-100 text-blue-700',
  kegiatan: 'bg-green-100 text-green-700',
  pengumuman: 'bg-amber-100 text-amber-700',
}
const CAT_LABEL: Record<string, string> = {
  berita: 'Berita', kegiatan: 'Kegiatan', pengumuman: 'Pengumuman',
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false })
  if (params.category) query = query.eq('category', params.category)

  const { data: dbData } = await query
  const allPosts = dbData || []

  const filtered = params.category
    ? allPosts.filter((p) => p.category === params.category)
    : allPosts

  // Featured = first post
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Newspaper size={20} className="text-amber-600" />
          </div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Terkini</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900">Berita & Kegiatan</h1>
        <p className="text-gray-500 mt-1">Dokumentasi kegiatan, program, dan informasi terbaru Posyantek</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8 animate-fade-up delay-100">
        {[
          { value: '', label: 'Semua' },
          { value: 'berita', label: 'Berita' },
          { value: 'kegiatan', label: 'Kegiatan' },
          { value: 'pengumuman', label: 'Pengumuman' },
        ].map((t) => (
          <Link
            key={t.value}
            href={t.value ? `/berita?category=${t.value}` : '/berita'}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              (params.category || '') === t.value
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Newspaper size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Belum ada postingan</p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Link
              href={`/berita/${featured.id}`}
              className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover mb-8 animate-fade-up delay-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-full bg-gradient-to-br from-green-50 to-emerald-50 img-zoom min-h-52">
                  {featured.cover_url ? (
                    <Image src={featured.cover_url} alt={featured.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar size={56} className="text-green-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${CAT_COLOR[featured.category] || 'bg-gray-100 text-gray-600'}`}>
                      {CAT_LABEL[featured.category] || featured.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Calendar size={12} />
                    {new Date(featured.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-2xl font-black text-gray-800 leading-tight mb-3 group-hover:text-green-700 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green-700 group-hover:gap-2.5 transition-all">
                    Baca Selengkapnya →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Rest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <Link
                key={post.id}
                href={`/berita/${post.id}`}
                className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover animate-fade-up delay-${(i % 3 + 1) * 100}`}
              >
                <div className="relative h-44 bg-gradient-to-br from-gray-50 to-green-50 img-zoom">
                  {post.cover_url ? (
                    <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar size={36} className="text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CAT_COLOR[post.category] || 'bg-gray-100 text-gray-600'}`}>
                      {CAT_LABEL[post.category] || post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
