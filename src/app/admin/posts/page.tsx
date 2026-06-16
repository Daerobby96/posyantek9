import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Plus, Newspaper } from 'lucide-react'
import DeletePostButton from './DeletePostButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Berita & Kegiatan' }

const CAT_COLOR: Record<string, string> = {
  berita:      'bg-blue-900/40 text-blue-300 border-blue-800',
  kegiatan:    'bg-green-900/40 text-green-300 border-green-800',
  pengumuman:  'bg-amber-900/40 text-amber-300 border-amber-800',
}
const CAT_LABEL: Record<string, string> = {
  berita: 'Berita', kegiatan: 'Kegiatan', pengumuman: 'Pengumuman',
}

export default async function AdminPostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, category, published, created_at, excerpt')
    .order('created_at', { ascending: false })

  const all = (posts as Post[]) || []

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Berita & Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">{all.length} artikel</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-green-900/30"
        >
          <Plus size={16} /> Tulis Artikel
        </Link>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
          <Newspaper size={36} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 mb-2">Belum ada artikel</p>
          <Link href="/admin/posts/new" className="text-green-400 hover:text-green-300 text-sm font-semibold">
            + Tulis artikel pertama
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {['Judul', 'Kategori', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {all.map((post) => (
                  <tr key={post.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-white font-semibold text-sm line-clamp-1">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${CAT_COLOR[post.category] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                        {CAT_LABEL[post.category] || post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        post.published
                          ? 'bg-green-900/40 text-green-300 border-green-800'
                          : 'bg-gray-700 text-gray-500 border-gray-600'
                      }`}>
                        {post.published ? 'Dipublikasi' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(post.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/posts/${post.id}`} className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-900/30 transition-colors">
                          Edit
                        </Link>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
