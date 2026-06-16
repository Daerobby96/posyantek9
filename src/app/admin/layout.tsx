import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import ToastContainer from '@/components/Toast'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard Admin',
    template: '%s — Admin Posyantek',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    /* Full-screen dark shell — tidak ada Navbar/Footer publik */
    <div className="min-h-screen bg-gray-950 flex text-gray-100">

      {/* Sidebar tetap di kiri */}
      <AdminSidebar />

      {/* Konten utama — geser kanan sejauh lebar sidebar di lg+ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminTopbar
          userName={profile?.full_name || user.email || 'Admin'}
          userEmail={user.email || ''}
        />
        <main className="flex-1 p-5 md:p-6 overflow-auto min-h-0">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
