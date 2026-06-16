import PostForm from '../PostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tulis Artikel' }

export default function NewPostPage() {
  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white">Tulis Artikel Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Buat berita, laporan kegiatan, atau pengumuman</p>
      </div>
      <PostForm />
    </div>
  )
}
