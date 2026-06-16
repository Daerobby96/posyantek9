-- ================================================
-- POSYANTEK - SEEDER DATA LENGKAP
-- Jalankan file ini di Supabase SQL Editor 
-- HANYA SETELAH Anda menjalankan supabase-schema.sql
-- ================================================

-- 1. SEED KATEGORI PRODUK UMKM
INSERT INTO categories (name, slug) VALUES
  ('Anyaman Bambu', 'anyaman-bambu'),
  ('Batik Tulis', 'batik-tulis'),
  ('Gerabah & Keramik', 'gerabah-keramik'),
  ('Makanan Ringan', 'makanan-ringan'),
  ('Minuman Herbal', 'minuman-herbal')
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PRODUK UMKM
-- Asumsi ID Kategori diambil menggunakan subquery untuk menghindari masalah UUID
INSERT INTO products (name, description, price, stock, is_active, category_id) VALUES
  ('Keranjang Anyaman Serbaguna', 'Keranjang anyaman bambu kokoh untuk piknik atau parcel.', 45000, 20, true, (SELECT id FROM categories WHERE slug = 'anyaman-bambu')),
  ('Tikar Bambu Lipat', 'Tikar bambu alami yang sejuk dan mudah dilipat.', 85000, 15, true, (SELECT id FROM categories WHERE slug = 'anyaman-bambu')),
  ('Kain Batik Motif Klasik', 'Kain batik tulis asli pewarna alami ukuran 2x1 meter.', 250000, 10, true, (SELECT id FROM categories WHERE slug = 'batik-tulis')),
  ('Kemeja Batik Pria', 'Kemeja lengan pendek berbahan katun dengan motif khas daerah.', 150000, 12, true, (SELECT id FROM categories WHERE slug = 'batik-tulis')),
  ('Vas Bunga Tanah Liat', 'Vas bunga gerabah dengan ukiran estetis.', 35000, 30, true, (SELECT id FROM categories WHERE slug = 'gerabah-keramik')),
  ('Piring Makan Keramik', 'Piring makan keramik tahan panas isi 6.', 90000, 8, true, (SELECT id FROM categories WHERE slug = 'gerabah-keramik')),
  ('Keripik Pisang Coklat Lumer', 'Keripik pisang renyah dengan lelehan coklat premium (200gr).', 15000, 50, true, (SELECT id FROM categories WHERE slug = 'makanan-ringan')),
  ('Rengginang Lorjuk', 'Rengginang gurih khas pesisir dengan taburan lorjuk.', 20000, 40, true, (SELECT id FROM categories WHERE slug = 'makanan-ringan')),
  ('Wedang Jahe Merah Instan', 'Jahe merah bubuk siap seduh penghangat badan (250gr).', 30000, 25, true, (SELECT id FROM categories WHERE slug = 'minuman-herbal')),
  ('Sirup Temulawak Asli', 'Sirup temulawak segar untuk menjaga stamina tubuh (500ml).', 40000, 15, true, (SELECT id FROM categories WHERE slug = 'minuman-herbal'));

-- 3. SEED BERITA, KEGIATAN & PENGUMUMAN (POSTS)
INSERT INTO posts (title, slug, excerpt, content, category, published) VALUES
  (
    'Pelatihan Pengolahan Sampah Organik Menjadi Kompos', 
    'pelatihan-kompos-organik', 
    'Warga antusias mengikuti pelatihan pengolahan sampah organik menjadi pupuk kompos yang bernilai ekonomi tinggi di balai desa.', 
    'Pelatihan ini diadakan selama 2 hari, di mana warga diajarkan metode pengomposan aerob dan anaerob. Diharapkan setiap rumah tangga dapat mulai mengelola sampah organiknya sendiri sehingga lingkungan menjadi lebih bersih dan subur.', 
    'kegiatan', 
    true
  ),
  (
    'Kaji Tiru TTG Pompa Hidram ke Kabupaten Tetangga', 
    'kaji-tiru-pompa-hidram', 
    'Tim Posyantek melakukan kaji tiru teknologi pompa hidram yang berhasil diterapkan di desa mandiri air.', 
    'Dalam kunjungan ini, tim mempelajari skema instalasi hidram, perhitungan debit air, hingga pemeliharaan pipa. Hasil kunjungan ini akan diadaptasi untuk pembangunan pompa hidram di desa kita tahun depan.', 
    'berita', 
    true
  ),
  (
    'Pameran Produk UMKM Binaan Posyantek di Alun-Alun', 
    'pameran-umkm-alun-alun', 
    'Ratusan pengunjung memadati stand pameran UMKM Posyantek di perayaan hari jadi kabupaten.', 
    'Produk anyaman bambu dan keripik pisang menjadi primadona dalam pameran kali ini. Total omzet para pelaku UMKM selama pameran mencapai angka yang sangat memuaskan.', 
    'berita', 
    true
  ),
  (
    'Pengumuman: Pendaftaran Pelatihan Pemasaran Digital', 
    'pengumuman-pelatihan-digital-marketing', 
    'Dibuka pendaftaran untuk pelatihan Pemasaran Digital bagi pelaku UMKM. Kuota terbatas 30 peserta.', 
    'Syarat pendaftaran: memiliki produk UMKM sendiri dan membawa smartphone/laptop. Pendaftaran dilakukan di kantor Posyantek setiap jam kerja paling lambat akhir bulan ini.', 
    'pengumuman', 
    true
  ),
  (
    'Sosialisasi Penggunaan Mesin Pencacah Pakan Ternak', 
    'sosialisasi-mesin-pencacah', 
    'Peternak sapi kini dapat membuat pakan sendiri dengan lebih efisien berkat bantuan mesin pencacah rumput gajah.', 
    'Dengan adanya alat TTG pencacah pakan, waktu persiapan pakan ternak dapat dipangkas dari 2 jam menjadi 15 menit. Posyantek menyediakan unit yang dapat disewa atau digunakan bersama oleh kelompok ternak.', 
    'kegiatan', 
    true
  ),
  (
    'Kunjungan Kerja Dinas Pemberdayaan Masyarakat Provinsi', 
    'kunker-dpmd-provinsi', 
    'Posyantek kita mendapat apresiasi atas inovasi pengelolaan alat tepat guna yang mandiri dan berkelanjutan.', 
    'Kepala Dinas Provinsi menyatakan bahwa model manajerial alat TTG yang diterapkan di sini akan dijadikan percontohan untuk posyantek di wilayah lain.', 
    'berita', 
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED KATALOG TEKNOLOGI TEPAT GUNA (TTG)
INSERT INTO ttg (name, description, bidang, cara_kerja) VALUES
  (
    'Mesin Penetas Telur Otomatis', 
    'Mesin penetas telur ayam/bebek berkapasitas 100 butir yang dilengkapi pengatur suhu otomatis dan pemutar telur berkala.', 
    'peternakan', 
    'Lampu pemanas akan menyala jika suhu di bawah 37.5°C dan mati otomatis di 38°C. Rak telur akan berayun 45 derajat setiap 3 jam sekali menggunakan motor sinkron kecil.'
  ),
  (
    'Alat Pengering Tenaga Surya (Solar Dryer Dome)', 
    'Kubah plastik UV untuk mengeringkan hasil panen (kopi, kakao, kerupuk) yang melindunginya dari hujan dan debu namun memaksimalkan panas matahari.', 
    'pertanian', 
    'Sinar matahari menembus plastik UV dan memanaskan ruangan. Udara lembab dari hasil panen yang menguap akan disedot keluar menggunakan kipas exhaust bertenaga panel surya mini.'
  ),
  (
    'Pompa Hidram (Hydraulic Ram Pump)', 
    'Pompa air mekanis yang bekerja 24 jam memompa air dari bawah ke atas bukit murni menggunakan tenaga air tanpa butuh listrik atau BBM.', 
    'pertanian', 
    'Memanfaatkan fenomena "Water Hammer". Air yang mengalir dari sumber akan menutup katup buang secara tiba-tiba, menciptakan tekanan tinggi yang memaksa sebagian air naik melewati katup hantar.'
  ),
  (
    'Mesin Pencacah Plastik Mini', 
    'Alat sederhana untuk menghancurkan limbah botol plastik menjadi cacahan/flakes yang siap dijual ke pabrik daur ulang.', 
    'lingkungan', 
    'Botol plastik dimasukkan ke corong atas, lalu akan digilas dan dipotong oleh pisau baja berputar berkecepatan tinggi yang digerakkan oleh motor listrik 1 HP.'
  ),
  (
    'Biodigester Skala Rumah Tangga', 
    'Reaktor pembuat gas metana dari limbah organik dapur dan kotoran hewan untuk substitusi gas elpiji memasak.', 
    'energi', 
    'Bakteri anaerob (tanpa oksigen) akan mencerna bubur limbah organik di dalam tabung kedap udara. Proses pencernaan ini menghasilkan gas metana yang dialirkan melalui pipa ke kompor.'
  ),
  (
    'Alat Filtrasi Air Gambut Berbasis Pasir Silika', 
    'Instalasi penyaring air rawa/gambut yang keruh dan asam menjadi air jernih dan layak untuk sanitasi.', 
    'kesehatan', 
    'Air baku diendapkan menggunakan tawas, lalu dialirkan melewati beberapa lapis media saring mulai dari kerikil, pasir silika kasar, pasir silika halus, dan arang aktif untuk menghilangkan warna dan bau.'
  );
