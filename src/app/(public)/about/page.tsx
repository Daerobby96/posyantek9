import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, BookOpen, Target, Users, Scale, MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Tentang Posyantek' }

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-14 animate-fade-up">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white text-3xl font-black">PT</span>
        </div>
        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Lembaga</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">Tentang Posyantek</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
          Pos Pelayanan Teknologi Tepat Guna — Menjembatani Masyarakat dengan Teknologi untuk Kesejahteraan Bersama
        </p>
      </div>

      {/* ── Apa itu Posyantek ── */}
      <section className="mb-12 animate-fade-up">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Apa itu Posyantek?</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-5">
            <strong className="text-gray-900">Posyantek (Pos Pelayanan Teknologi)</strong> adalah lembaga kemasyarakatan
            yang bertugas melaksanakan inventarisasi dan identifikasi berbagai jenis teknologi tepat guna (TTG)
            yang telah digunakan dan dibutuhkan masyarakat.
          </p>
          <p className="text-gray-600 leading-relaxed mb-5">
            Posyantek berfungsi menjembatani masyarakat pengguna TTG dengan memberikan kemudahan
            pelayanan teknis, informasi, dan promosi TTG, serta meningkatkan kerja sama antar pemangku kepentingan
            dalam pengembangan dan pendayagunaan teknologi tepat guna.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Keberadaan Posyantek didasarkan pada amanat pemerintah melalui Peraturan Menteri Dalam Negeri
            tentang Pedoman Pengembangan dan Pendayagunaan Teknologi Tepat Guna, sebagai bagian dari upaya
            pemberdayaan masyarakat secara menyeluruh di tingkat kecamatan dan desa.
          </p>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Visi & Misi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Visi */}
          <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-7 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="font-black text-xl mb-4">Visi</h3>
            <p className="text-green-100 leading-relaxed">
              Terwujudnya masyarakat yang mandiri dan sejahtera melalui penguasaan,
              pemanfaatan, dan pengembangan teknologi tepat guna yang inovatif dan
              berkelanjutan untuk kemajuan ekonomi lokal.
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-4">Misi</h3>
            <ul className="space-y-2.5">
              {[
                'Melakukan inventarisasi dan identifikasi TTG yang dibutuhkan masyarakat',
                'Memberikan pelayanan teknis, informasi, dan promosi TTG',
                'Meningkatkan kapasitas masyarakat dalam pemanfaatan TTG',
                'Mendorong pengembangan dan inovasi TTG lokal',
                'Membangun kemitraan strategis untuk pengembangan TTG',
                'Mendukung peningkatan kualitas dan pemasaran produk UKM',
              ].map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2"></span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Fungsi Utama ── */}
      <section className="mb-12 animate-fade-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={20} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Fungsi Utama</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: '🔍',
              title: 'Inventarisasi & Identifikasi',
              desc: 'Melakukan pendataan dan identifikasi TTG yang telah digunakan serta yang masih dibutuhkan masyarakat.',
              color: 'border-t-4 border-blue-400',
            },
            {
              icon: '🔧',
              title: 'Pelayanan Teknis',
              desc: 'Memberikan kemudahan pelayanan teknis berupa konsultasi, pendampingan, dan penerapan TTG.',
              color: 'border-t-4 border-green-400',
            },
            {
              icon: '📚',
              title: 'Informasi & Orientasi',
              desc: 'Menyediakan informasi dan orientasi tentang berbagai jenis TTG untuk membantu masyarakat.',
              color: 'border-t-4 border-purple-400',
            },
            {
              icon: '📣',
              title: 'Promosi TTG & UMKM',
              desc: 'Memfasilitasi promosi dan pemasaran produk TTG serta UMKM binaan kepada masyarakat luas.',
              color: 'border-t-4 border-amber-400',
            },
          ].map((item) => (
            <div key={item.title} className={`bg-white rounded-2xl ${item.color} shadow-sm p-6 card-hover`}>
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h3 className="font-black text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dasar Hukum ── */}
      <section className="mb-12 animate-fade-up">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Scale size={20} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Dasar Hukum</h2>
          </div>
          <ul className="space-y-3">
            {[
              'UU No. 6 Tahun 2014 tentang Desa',
              'Peraturan Menteri Dalam Negeri tentang Pedoman Pengembangan dan Pendayagunaan Teknologi Tepat Guna',
              'Perda Provinsi tentang Pengembangan TTG dan Pemberdayaan Masyarakat',
              'SK Bupati tentang Pembentukan dan Penetapan Posyantek Kecamatan',
              'SK Camat tentang Pengurus Posyantek Kecamatan',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600">
                <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Kontak ── */}
      <section className="animate-fade-up">
        <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-6 text-center">Hubungi Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: MapPin, label: 'Alamat', value: 'Jl. Contoh No. 1, Kecamatan Contoh, Kabupaten Contoh' },
              { icon: Phone, label: 'Telepon', value: '(021) 1234-5678' },
              { icon: Mail, label: 'Email', value: 'info@posyantek.id' },
              { icon: Clock, label: 'Jam Operasional', value: 'Senin - Jumat, 08.00 - 17.00 WIB' },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <c.icon size={18} />
                </div>
                <p className="text-green-200 text-xs font-medium">{c.label}</p>
                <p className="text-white text-sm font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition-all btn-press"
            >
              Lihat Profil Lengkap <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
