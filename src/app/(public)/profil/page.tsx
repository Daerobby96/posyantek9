import type { Metadata } from 'next'
import { CheckCircle2, BookOpen, Target, Users, Scale } from 'lucide-react'

export const metadata: Metadata = { title: 'Profil Lembaga' }

const PENGURUS = [
  { nama: 'Drs. Ahmad Santoso, M.Si', jabatan: 'Ketua', foto: null },
  { nama: 'Siti Rahayu, S.T', jabatan: 'Sekretaris', foto: null },
  { nama: 'Budi Prasetyo, S.E', jabatan: 'Bendahara', foto: null },
  { nama: 'Ir. Hendra Wijaya', jabatan: 'Koordinator Bidang TTG', foto: null },
  { nama: 'Dra. Maya Lestari', jabatan: 'Koordinator Bidang UMKM', foto: null },
  { nama: 'Agus Wibowo, S.T', jabatan: 'Koordinator Bidang Informasi', foto: null },
]

export default function ProfilPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Lembaga</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">Profil Posyantek</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Pos Pelayanan Teknologi Tepat Guna Kecamatan Contoh, Kabupaten Contoh
        </p>
      </div>

      {/* Tab nav (anchor-based) */}
      <div className="flex gap-2 flex-wrap justify-center mb-12 animate-fade-up delay-100">
        {[
          { href: '#sejarah', label: 'Sejarah & Dasar Hukum' },
          { href: '#visi-misi', label: 'Visi & Misi' },
          { href: '#tujuan', label: 'Tujuan' },
          { href: '#struktur', label: 'Struktur Organisasi' },
        ].map((t) => (
          <a
            key={t.href}
            href={t.href}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all"
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* ── Sejarah & Dasar Hukum ── */}
      <section id="sejarah" className="mb-16 scroll-mt-24 animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sejarah & Dasar Hukum</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
          <p className="text-gray-600 leading-relaxed mb-5">
            Posyantek dibentuk berdasarkan amanat pemerintah dalam upaya meningkatkan 
            pelayanan teknologi tepat guna kepada masyarakat. Posyantek Kecamatan Contoh 
            berdiri sejak tahun 2015 dan telah berkembang menjadi pusat pelayanan TTG 
            yang aktif melayani masyarakat di wilayah kecamatan.
          </p>
          <p className="text-gray-600 leading-relaxed mb-7">
            Keberadaan Posyantek semakin diperkuat dengan regulasi-regulasi yang mendukung 
            pengembangan teknologi tepat guna di tingkat desa dan kecamatan sebagai bagian 
            dari program pemberdayaan masyarakat secara menyeluruh.
          </p>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Scale size={16} className="text-green-600" />
              <h3 className="font-bold text-gray-800">Dasar Hukum</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'UU No. 6 Tahun 2014 tentang Desa',
                'Peraturan Menteri Dalam Negeri tentang Pedoman Pengembangan dan Pendayagunaan Teknologi Tepat Guna',
                'Perda Provinsi tentang Pengembangan TTG dan Pemberdayaan Masyarakat',
                'SK Bupati tentang Pembentukan dan Penetapan Posyantek Kecamatan',
                'SK Camat tentang Pengurus Posyantek Kecamatan Contoh',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section id="visi-misi" className="mb-16 scroll-mt-24 animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-green-600" />
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

      {/* ── Tujuan ── */}
      <section id="tujuan" className="mb-16 scroll-mt-24 animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <span className="text-xl">🎖️</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Tujuan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: '🤝',
              title: 'Menjembatani Masyarakat',
              desc: 'Menjembatani masyarakat pengguna TTG dengan sumber daya teknologi yang tersedia, sehingga teknologi dapat diakses dan dimanfaatkan secara optimal.',
              color: 'border-t-4 border-blue-400',
            },
            {
              icon: '⚡',
              title: 'Kemudahan Pelayanan',
              desc: 'Memberikan kemudahan pelayanan teknis, informasi, dan promosi berbagai jenis TTG kepada masyarakat agar dapat meningkatkan produktivitas.',
              color: 'border-t-4 border-green-400',
            },
            {
              icon: '🌐',
              title: 'Meningkatkan Kerja Sama',
              desc: 'Meningkatkan kerja sama antar pemangku kepentingan dalam pengembangan dan pendayagunaan TTG untuk pemberdayaan masyarakat yang berkelanjutan.',
              color: 'border-t-4 border-amber-400',
            },
          ].map((t) => (
            <div key={t.title} className={`bg-white rounded-2xl ${t.color} shadow-sm p-6 card-hover`}>
              <span className="text-4xl block mb-4">{t.icon}</span>
              <h3 className="font-black text-gray-800 mb-3">{t.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Struktur Organisasi ── */}
      <section id="struktur" className="scroll-mt-24 animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Struktur Organisasi</h2>
        </div>

        {/* Ketua di atas */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-6 text-center text-white w-64 shadow-lg">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl">
              👤
            </div>
            <p className="font-black">{PENGURUS[0].nama}</p>
            <p className="text-green-200 text-sm mt-1 font-semibold">{PENGURUS[0].jabatan}</p>
          </div>
        </div>

        {/* Sekretaris & Bendahara */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
          {PENGURUS.slice(1, 3).map((p) => (
            <div key={p.nama} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm card-hover">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                👤
              </div>
              <p className="font-bold text-gray-800 text-sm">{p.nama}</p>
              <p className="text-green-600 text-xs mt-1 font-semibold">{p.jabatan}</p>
            </div>
          ))}
        </div>

        {/* Koordinator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PENGURUS.slice(3).map((p) => (
            <div key={p.nama} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm card-hover">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                👤
              </div>
              <p className="font-bold text-gray-800 text-sm">{p.nama}</p>
              <p className="text-blue-600 text-xs mt-1 font-semibold">{p.jabatan}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
