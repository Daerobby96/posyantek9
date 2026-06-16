import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PostForm from '../PostForm'
import { Post } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Artikel' }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()
  return (
    <div className="space-y-5 pb-20 lg:pb-0 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-white">Edit Artikel</h1>
        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{post.title}</p>
      </div>
      <PostForm post={post as Post} />
    </div>
  )
}
