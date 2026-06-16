import type { Metadata } from 'next'
import { Wrench, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Layanan' }

const LAYANAN = [
  {
    icon: '🔧',
    title: 'Pelayanan Teknis',
    desc: 'Konsultasi, pendampingan, dan penerapan TTG langsung di lapangan kepada masyarakat pengguna, kelompok tani, atau pelaku usaha.',
    detail: [
      'Konsultasi teknis pemilihan TTG yang sesuai',
      'Pendampingan instalasi dan pengoperasian TTG',
      'Pemeliharaan dan perbaikan alat TTG',
      'Evaluasi kinerja TTG yang sudah digunakan',
    ],
    color: 'bg-blue-50 border-t-4 border-blue-400',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '📚',
    title: 'Informasi & Orientasi TTG',
    desc: 'Penyediaan informasi lengkap tentang berbagai jenis TTG, cara kerja, manfaat, dan sumber perolehannya untuk membantu masyarakat dalam pengambilan keputusan.',
    detail: [
      'Perpustakaan dan referensi TTG',
      'Leaflet, brosur, dan media informasi TTG',
      'Konsultasi pemilihan TTG yang tepat',
      'Database katalog TTG yang tersedia',
    ],
    color: 'bg-green-50 border-t-4 border-green-400',
    iconBg: 'bg-green-100',
  },
  {
    icon: '📣',
    title: 'Promosi Produk TTG & UMKM',
    desc: 'Memfasilitasi promosi dan pemasaran produk yang dihasilkan oleh TTG serta produk UMKM binaan kepada masyarakat luas dan pasar yang lebih besar.',
    detail: [
      'Pameran dan expo produk TTG',
      'Pemasaran online melalui platform digital',
      'Koneksi dengan distributor dan pembeli',
      'Branding dan kemasan produk UMKM',
    ],
    color: 'bg-amber-50 border-t-4 border-amber-400',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '🎓',
    title: 'Pelatihan & Penyuluhan',
    desc: 'Program peningkatan kapasitas dan keterampilan masyarakat dalam penggunaan TTG, pengembangan produk, dan manajemen usaha.',
    detail: [
      'Pelatihan penggunaan dan perawatan TTG',
      'Penyuluhan teknologi pertanian terkini',
      'Pelatihan kewirausahaan berbasis TTG',
      'Workshop pengembangan produk',
    ],
    color: 'bg-purple-50 border-t-4 border-purple-400',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '🔍',
    title: 'Inventarisasi & Identifikasi TTG',
    desc: 'Kegiatan pendataan dan identifikasi jenis TTG yang telah digunakan masyarakat serta yang masih dibutuhkan untuk pemenuhan kebutuhan lokal.',
    detail: [
      'Survei kebutuhan TTG masyarakat',
      'Pendataan TTG yang sudah digunakan',
      'Analisis kebutuhan dan gap TTG',
      'Rekomendasi TTG yang sesuai kebutuhan',
    ],
    color: 'bg-teal-50 border-t-4 border-teal-400',
    iconBg: 'bg-teal-100',
  },
  {
    icon: '🤝',
    title: 'Fasilitasi Kerja Sama',
    desc: 'Memfasilitasi kerja sama antara masyarakat pengguna TTG dengan instansi pemerintah, perguruan tinggi, lembaga penelitian, dan dunia usaha.',
    detail: [
      'Penjajakan kerja sama dengan instansi',
      'Penghubung dengan lembaga penelitian TTG',
      'Fasilitasi akses permodalan usaha',
      'Program kemitraan usaha produktif',
    ],
    color: 'bg-rose-50 border-t-4 border-rose-400',
    iconBg: 'bg-rose-100',
  },
]

export default function LayananPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-14 animate-fade-up">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Wrench size={26} className="text-green-600" />
        </div>
        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Posyantek</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">Layanan Kami</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
          Posyantek menyediakan berbagai layanan teknis, informasi, dan promosi TTG 
          untuk mendukung kemajuan masyarakat dan UMKM lokal.
        </p>
      </div>

      {/* Layanan grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {LAYANAN.map((l, i) => (
          <div
            key={l.title}
            className={`${l.color} rounded-2xl p-6 card-hover animate-fade-up delay-${(i % 3 + 1) * 100}`}
          >
            <div className={`w-12 h-12 ${l.iconBg} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
              {l.icon}
            </div>
            <h3 className="font-black text-gray-800 mb-2">{l.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{l.desc}</p>
            <ul className="space-y-1.5">
              {l.detail.map((d) => (
                <li key={d} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="w-1 h-1 bg-gray-400 rounded-full shrink-0 mt-1.5"></span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Cara Mengakses Layanan */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-3xl p-8 text-white mb-10 animate-fade-up">
        <h2 className="text-2xl font-black mb-6 text-center">Cara Mengakses Layanan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {[
            { step: '1', title: 'Hubungi Kami', desc: 'Datang langsung atau hubungi via telepon/WhatsApp' },
            { step: '2', title: 'Konsultasi', desc: 'Tim kami akan mendengar kebutuhan dan memberikan solusi TTG' },
            { step: '3', title: 'Tindak Lanjut', desc: 'Kami menindaklanjuti dengan pelayanan teknis atau informasi' },
            { step: '4', title: 'Evaluasi', desc: 'Pemantauan dan evaluasi keberhasilan penerapan TTG' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-black">
                {s.step}
              </div>
              <h4 className="font-bold mb-1">{s.title}</h4>
              <p className="text-xs text-green-100/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kontak */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fade-up">
        <h2 className="text-xl font-black text-gray-800 mb-6 text-center">Hubungi Posyantek</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Phone, label: 'Telepon / WhatsApp', value: '(021) 1234-5678', href: 'tel:0211234567' },
            { icon: Mail, label: 'Email', value: 'info@posyantek.id', href: 'mailto:info@posyantek.id' },
            { icon: MapPin, label: 'Alamat', value: 'Jl. Contoh No. 1, Kecamatan Contoh', href: '#' },
          ].map((c) => (
            <a key={c.label} href={c.href} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-transparent transition-all group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <c.icon size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800 transition-colors"
          >
            Lihat Profil Lengkap <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
