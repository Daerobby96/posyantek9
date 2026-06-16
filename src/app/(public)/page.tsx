import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'
import {
  ArrowRight, Cpu, Wrench, Newspaper, Store, Image as ImageIcon,
  Handshake, Calendar, ChevronRight, CheckCircle2, Users,
  BookOpen, Lightbulb, GraduationCap, Megaphone, MapPin,
  Shield, Zap, Globe,
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const { data: rawPosts } = await supabase
    .from('posts')
    .select('id, title, excerpt, cover_url, category, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const featuredProducts = (products as Product[]) || []
  const posts = rawPosts || []

  const catColor: Record<string, string> = {
    berita: 'bg-blue-100 text-blue-700',
    kegiatan: 'bg-green-100 text-green-700',
    pengumuman: 'bg-amber-100 text-amber-700',
  }
  const catLabel: Record<string, string> = {
    berita: 'Berita', kegiatan: 'Kegiatan', pengumuman: 'Pengumuman',
  }

  return (
    <div>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden bg-[#071510] text-white min-h-[92vh] flex flex-col">

        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0d2b1c] to-[#071510]" />
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-green-600/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[100px]" style={{ animation: 'pulse-glow 6s ease-in-out infinite 2s' }} />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-green-900/30 animate-border-flow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-green-900/15" />
        </div>

        {/* Main content */}
        <div className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

            {/* LEFT */}
            <div>
              {/* Location badge */}
              <div className="animate-hero-1 inline-flex items-center gap-2.5 mb-8">
                <span className="flex items-center gap-2 bg-green-900/60 border border-green-700/50 backdrop-blur-sm text-green-300 text-xs font-semibold px-4 py-2 rounded-full">
                  <MapPin size={12} className="shrink-0" />
                  Kecamatan Contoh, Kabupaten Contoh
                </span>
              </div>

              {/* Headline */}
              <h1 className="animate-hero-2 text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="block text-white">Pos Pelayanan</span>
                <span className="block text-gradient-green mt-1">Teknologi</span>
                <span className="block text-white mt-1">Tepat Guna</span>
              </h1>

              {/* Tagline */}
              <p className="animate-hero-3 text-green-200/75 text-lg leading-relaxed max-w-lg mb-10">
                Menjembatani masyarakat dengan teknologi tepat guna — layanan teknis,
                informasi, dan promosi produk UMKM lokal untuk kesejahteraan bersama.
              </p>

              {/* CTA */}
              <div className="animate-hero-4 flex flex-wrap gap-3 mb-12">
                <Link href="/profil" className="group inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/40 btn-press">
                  Tentang Posyantek
                  <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/layanan" className="inline-flex items-center gap-2.5 bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl transition-all btn-press">
                  Layanan Kami
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-hero-5 flex items-center flex-wrap">
                {[
                  { value: '50+',  label: 'Katalog TTG',   icon: Cpu },
                  { value: '120+', label: 'UMKM Binaan',   icon: Store },
                  { value: '15+',  label: 'Mitra Lembaga', icon: Handshake },
                ].map((s, i) => (
                  <div key={s.label} className={`flex items-center gap-3 px-5 py-3 ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <div className="w-9 h-9 bg-green-900/60 rounded-xl flex items-center justify-center shrink-0">
                      <s.icon size={16} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                      <p className="text-xs text-green-300/70 mt-0.5 font-medium">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Feature cards */}
            <div className="hidden lg:block animate-hero-r">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu,      title: 'Katalog TTG',       desc: 'Inventarisasi & identifikasi teknologi tepat guna', href: '/ttg',     delay: 'hero-card-1', accent: 'border-blue-500/30 hover:border-blue-400/50',   iconBg: 'bg-blue-500/10 text-blue-400' },
                  { icon: Wrench,   title: 'Layanan Teknis',    desc: 'Konsultasi, pendampingan, dan penerapan TTG',        href: '/layanan', delay: 'hero-card-2', accent: 'border-green-500/30 hover:border-green-400/50', iconBg: 'bg-green-500/10 text-green-400' },
                  { icon: Store,    title: 'UMKM Binaan',       desc: 'Produk unggulan lokal berbasis TTG',                href: '/umkm',    delay: 'hero-card-3', accent: 'border-purple-500/30 hover:border-purple-400/50',iconBg: 'bg-purple-500/10 text-purple-400' },
                  { icon: Newspaper,title: 'Berita & Kegiatan', desc: 'Dokumentasi program dan kegiatan terkini',          href: '/berita',  delay: 'hero-card-4', accent: 'border-amber-500/30 hover:border-amber-400/50',  iconBg: 'bg-amber-500/10 text-amber-400' },
                ].map((c, i) => (
                  <Link key={c.title} href={c.href}
                    className={`${c.delay} group relative bg-white/4 backdrop-blur-md border ${c.accent} rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-white/7 hover:-translate-y-1 hover:shadow-2xl ${i % 2 === 1 ? 'mt-5' : ''}`}>
                    <div className={`w-11 h-11 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                      <c.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{c.title}</p>
                      <p className="text-xs text-green-200/50 mt-1 leading-relaxed">{c.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all self-end" />
                  </Link>
                ))}
              </div>
              {/* Trust strip */}
              <div className="mt-5 flex items-center gap-6 px-1">
                {[
                  { icon: Shield, text: 'Lembaga Resmi Pemerintah' },
                  { icon: Zap,    text: 'Berbasis Permendagri TTG' },
                  { icon: Globe,  text: 'Melayani Seluruh Kecamatan' },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-1.5 text-green-400/50">
                    <t.icon size={11} />
                    <span className="text-[10px] font-medium">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-14 shrink-0">
          <svg className="absolute bottom-0 left-0 w-full text-gray-50" viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none">
            <path d="M0 56L480 18L960 42L1440 0V56H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* ── MENU CEPAT ── */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { icon: Cpu,       label: 'Katalog TTG', href: '/ttg',     color: 'text-blue-700 bg-blue-50',   hover: 'hover:border-blue-200' },
              { icon: Wrench,    label: 'Layanan',     href: '/layanan', color: 'text-green-700 bg-green-50', hover: 'hover:border-green-200' },
              { icon: Newspaper, label: 'Berita',      href: '/berita',  color: 'text-amber-700 bg-amber-50', hover: 'hover:border-amber-200' },
              { icon: Store,     label: 'UMKM',        href: '/umkm',    color: 'text-purple-700 bg-purple-50',hover: 'hover:border-purple-200' },
              { icon: ImageIcon, label: 'Galeri',      href: '/galeri',  color: 'text-rose-700 bg-rose-50',   hover: 'hover:border-rose-200' },
              { icon: Handshake, label: 'Mitra',       href: '/mitra',   color: 'text-teal-700 bg-teal-50',   hover: 'hover:border-teal-200' },
            ].map((m) => (
              <Link key={m.href} href={m.href}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent ${m.hover} hover:shadow-sm transition-all group text-center`}>
                <div className={`w-12 h-12 ${m.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <m.icon size={22} />
                </div>
                <span className="text-xs font-semibold text-gray-700">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TENTANG SINGKAT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Tentang Kami</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Apa itu Posyantek?</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              <strong className="text-gray-900">Posyantek (Pos Pelayanan Teknologi)</strong> adalah lembaga kemasyarakatan
              yang bertugas melaksanakan inventarisasi dan identifikasi berbagai jenis teknologi tepat guna (TTG)
              yang telah digunakan dan dibutuhkan masyarakat.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Posyantek berfungsi menjembatani masyarakat pengguna TTG dengan memberikan kemudahan
              pelayanan teknis, informasi, dan promosi TTG, serta meningkatkan kerja sama antar pemangku kepentingan.
            </p>
            <ul className="space-y-3 mb-7">
              {[
                'Inventarisasi & identifikasi TTG yang dibutuhkan masyarakat',
                'Pelayanan teknis, konsultasi, dan pendampingan TTG',
                'Promosi produk TTG dan UKM kepada masyarakat luas',
                'Pelatihan, penyuluhan, dan peningkatan kapasitas masyarakat',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/profil" className="inline-flex items-center gap-2 bg-green-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition-colors shadow-sm btn-press">
              Profil Lengkap <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Lightbulb,  title: 'Inovasi TTG',    desc: 'Mendorong adopsi teknologi tepat guna lokal',           color: 'border-l-4 border-amber-500 bg-amber-50' },
              { icon: Users,      title: 'Pemberdayaan',   desc: 'Meningkatkan kapasitas melalui pelatihan TTG',          color: 'border-l-4 border-blue-500 bg-blue-50' },
              { icon: BookOpen,   title: 'Informasi',      desc: 'Pusat referensi teknologi tepat guna yang komprehensif', color: 'border-l-4 border-purple-500 bg-purple-50' },
              { icon: Handshake,  title: 'Kemitraan',      desc: 'Jaringan kerja sama instansi pemerintah dan swasta',    color: 'border-l-4 border-green-500 bg-green-50' },
            ].map((c) => (
              <div key={c.title} className={`${c.color} rounded-xl p-5 card-hover`}>
                <c.icon size={22} className="text-gray-700 mb-3" />
                <h3 className="font-bold text-gray-900 text-sm mb-1">{c.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAYANAN UNGGULAN ── */}
      <section className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Layanan Kami</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Layanan Posyantek</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm">Berbagai layanan teknis, informasi, dan pemberdayaan untuk masyarakat</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wrench,       title: 'Pelayanan Teknis',       desc: 'Konsultasi teknis, pendampingan, dan penerapan TTG langsung di lapangan' },
              { icon: BookOpen,     title: 'Informasi & Orientasi',  desc: 'Penyebaran informasi dan orientasi berbagai jenis TTG kepada masyarakat' },
              { icon: Megaphone,    title: 'Promosi TTG & UMKM',     desc: 'Memfasilitasi promosi produk TTG dan UMKM binaan ke pasar yang lebih luas' },
              { icon: GraduationCap,title: 'Pelatihan & Penyuluhan', desc: 'Peningkatan kualitas SDM melalui pelatihan keterampilan dan penyuluhan TTG' },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm card-hover">
                <div className="w-12 h-12 bg-green-50 text-green-700 rounded-lg flex items-center justify-center mb-4">
                  <s.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/layanan" className="inline-flex items-center gap-2 bg-green-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition-colors shadow-sm btn-press">
              Lihat Semua Layanan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BERITA & KEGIATAN ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Terkini</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Berita & Kegiatan</h2>
          </div>
          <Link href="/berita" className="hidden sm:inline-flex items-center gap-1.5 text-green-700 font-bold text-sm hover:text-green-800 transition-colors">
            Semua Berita <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/berita/${post.id}`} className="block bg-white rounded-xl border border-gray-200 overflow-hidden card-hover">
              <div className="relative h-48 bg-gray-100 img-zoom">
                {post.cover_url ? (
                  <Image src={post.cover_url} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar size={40} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${catColor[post.category] || 'bg-gray-100 text-gray-700'}`}>
                    {catLabel[post.category] || post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/berita" className="inline-flex items-center gap-2 text-green-700 font-semibold text-sm">
            Lihat Semua Berita <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── PRODUK UMKM ── */}
      <section className="bg-gray-50 border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Toko Online</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Produk UMKM Binaan</h2>
              <p className="text-gray-600 mt-1 text-sm">Hasil karya pengrajin lokal yang memanfaatkan TTG</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-green-700 font-bold text-sm hover:text-green-800 transition-colors">
              Lihat Semua <ArrowRight size={15} />
            </Link>
          </div>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-white border border-gray-200">
              <Store size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="font-bold text-gray-700 mb-1">Belum ada produk</p>
              <p className="text-sm text-gray-500">Produk UMKM akan muncul di sini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MITRA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Kemitraan</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">Mitra & Kerja Sama</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {['Dinas Pemberdayaan Masyarakat','Pemerintah Kecamatan','Universitas Setempat','Dinas Pertanian','LPMD / LKMD','Bank Daerah','Dinas Perindustrian','BPTP'].map((m) => (
            <div key={m} className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors card-hover">
              <Handshake size={16} className="text-green-600" />
              {m}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/mitra" className="inline-flex items-center gap-2 text-green-700 font-semibold text-sm hover:text-green-800 transition-colors">
            Lihat Semua Mitra <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0a1f14] text-white py-16 mb-10 mx-4 sm:mx-6 lg:mx-8 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-green-600/15 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-emerald-500/10 blur-[60px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Bersama Membangun Desa dengan TTG</h2>
          <p className="text-green-200/70 text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Bergabunglah dalam upaya pemanfaatan teknologi tepat guna untuk meningkatkan
            kesejahteraan masyarakat dan mendorong kemajuan UMKM lokal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/layanan" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg btn-press">
              Hubungi Kami <ArrowRight size={16} />
            </Link>
            <Link href="/ttg" className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-xl transition-all btn-press">
              Katalog TTG
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
