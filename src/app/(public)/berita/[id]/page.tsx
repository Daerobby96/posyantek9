import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ChevronRight, Tag, ArrowLeft } from 'lucide-react'

const CAT_COLOR: Record<string, string> = {
  berita: 'bg-blue-100 text-blue-700',
  kegiatan: 'bg-green-100 text-green-700',
  pengumuman: 'bg-amber-100 text-amber-700',
}
const CAT_LABEL: Record<string, string> = {
  berita: 'Berita', kegiatan: 'Kegiatan', pengumuman: 'Pengumuman',
}


export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const p = post as {
    id: string; title: string; category: string; created_at: string;
    cover_url: string | null; content: string; excerpt: string | null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-700 transition-colors">Beranda</Link>
        <ChevronRight size={12} />
        <Link href="/berita" className="hover:text-green-700 transition-colors">Berita</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 line-clamp-1">{p.title}</span>
      </nav>

      {/* Category & Date */}
      <div className="flex items-center gap-3 mb-4 animate-fade-up">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${CAT_COLOR[p.category] || 'bg-gray-100 text-gray-600'}`}>
          {CAT_LABEL[p.category] || p.category}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-6 animate-fade-up delay-100">
        {p.title}
      </h1>

      {/* Cover image */}
      {p.cover_url && (
        <div className="relative h-72 rounded-2xl overflow-hidden mb-8 shadow-md animate-fade-up delay-200">
          <Image src={p.cover_url} alt={p.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm animate-fade-up delay-200">
        <div className="prose prose-sm prose-gray max-w-none">
          {p.content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} className="font-bold text-gray-800 text-base mt-5 mb-2">{para.replace(/\*\*/g, '')}</h3>
            }
            if (para.startsWith('- ')) {
              return (
                <ul key={i} className="space-y-1 my-3">
                  {para.split('\n').map((li) => (
                    <li key={li} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                      {li.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              )
            }
            return <p key={i} className="text-gray-600 leading-relaxed text-sm mb-3">{para}</p>
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={15} /> Kembali ke Berita
        </Link>
      </div>
    </div>
  )
}
