import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Posyantek — Pos Pelayanan Teknologi",
    template: "%s | Posyantek",
  },
  description: "Pos Pelayanan Teknologi Tepat Guna. Menjembatani masyarakat dengan teknologi tepat guna, layanan teknis, informasi, dan promosi produk UMKM lokal.",
  keywords: ["posyantek", "teknologi tepat guna", "TTG", "UMKM", "kerajinan lokal"],
};

/**
 * Root layout — hanya menyediakan <html> dan <body>.
 * Navbar/Footer TIDAK ada di sini agar admin layout
 * bisa tampil tanpa elemen publik.
 *
 * Halaman publik mendapat Navbar+Footer dari
 * src/app/(public)/layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={geistSans.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
