import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = {
  lembaga: [
    { href: '/profil', label: 'Profil Lembaga' },
    { href: '/profil#struktur', label: 'Struktur Organisasi' },
    { href: '/profil#visi-misi', label: 'Visi & Misi' },
    { href: '/mitra', label: 'Mitra & Kerja Sama' },
  ],
  informasi: [
    { href: '/ttg', label: 'Katalog TTG' },
    { href: '/layanan', label: 'Layanan Kami' },
    { href: '/berita', label: 'Berita & Kegiatan' },
    { href: '/galeri', label: 'Galeri' },
  ],
  umkm: [
    { href: '/umkm', label: 'Produk UMKM Binaan' },
    { href: '/products', label: 'Toko Online' },
    { href: '/cart', label: 'Keranjang Belanja' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Info strip */}
      <div className="bg-green-700 overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-10 text-white text-xs font-medium">
              <span>🌿 Pos Pelayanan Teknologi Tepat Guna</span>
              <span>⚙️ Inventarisasi & Identifikasi TTG</span>
              <span>🤝 Pelayanan Teknis & Pendampingan</span>
              <span>🏭 Pemberdayaan UMKM Lokal</span>
              <span>📚 Informasi & Orientasi TTG</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow">
                <span className="text-white text-base font-black">PT</span>
              </div>
              <div>
                <span className="text-white font-black text-xl leading-none block">Posyantek</span>
                <span className="text-green-400 text-xs font-medium">Pos Pelayanan Teknologi</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              Lembaga pelayanan teknologi tepat guna yang menjembatani masyarakat dengan informasi, 
              layanan teknis, dan promosi TTG serta produk UMKM lokal.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>Jl. Contoh No. 1, Kecamatan Contoh, Kabupaten Contoh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-green-500 shrink-0" />
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-green-500 shrink-0" />
                <span>info@posyantek.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-green-500 shrink-0" />
                <span>Senin – Jumat, 08.00 – 17.00 WIB</span>
              </div>
            </div>
          </div>

          {/* Lembaga */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Lembaga</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.lembaga.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Informasi</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.informasi.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* UMKM */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">UMKM & Produk</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.umkm.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-1 group">
                    {l.label}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Posyantek — Pos Pelayanan Teknologi. Semua hak dilindungi.
          </p>
          <p className="text-xs text-gray-600">
            Berdasarkan Permendagri terkait Teknologi Tepat Guna
          </p>
        </div>
      </div>
    </footer>
  )
}
