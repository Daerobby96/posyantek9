-- ================================================
-- POSYANTEK E-COMMERCE - SUPABASE DATABASE SCHEMA
-- Jalankan SQL ini di Supabase SQL Editor
-- ================================================

-- 1. Tabel Kategori
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Produk
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Profil Pengguna (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Pesanan
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_name TEXT DEFAULT '',
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  payment_method TEXT DEFAULT 'transfer' CHECK (payment_method IN ('transfer', 'cod')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Item Pesanan
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Berita & Kegiatan (Posts)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  category TEXT DEFAULT 'berita' CHECK (category IN ('berita', 'kegiatan', 'pengumuman')),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Teknologi Tepat Guna (TTG)
CREATE TABLE IF NOT EXISTS ttg (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  bidang TEXT NOT NULL,
  cara_kerja TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttg ENABLE ROW LEVEL SECURITY;

-- Categories: semua bisa baca, admin bisa CRUD
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products: semua bisa baca aktif, admin bisa CRUD
CREATE POLICY "products_select" ON products FOR SELECT USING (
  is_active = TRUE OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "products_delete_admin" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: user bisa baca/edit profil sendiri, admin bisa baca semua
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_upsert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: user bisa CRUD pesanan sendiri, admin bisa semua
CREATE POLICY "orders_select" ON orders FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order Items: ikuti hak akses order
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (
      orders.user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Posts: semua bisa baca yang published, admin bisa CRUD
CREATE POLICY "posts_select" ON posts FOR SELECT USING (
  published = TRUE OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_insert_admin" ON posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_update_admin" ON posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_delete_admin" ON posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TTG: semua bisa baca, admin bisa CRUD
CREATE POLICY "ttg_select" ON ttg FOR SELECT USING (true);
CREATE POLICY "ttg_insert_admin" ON ttg FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "ttg_update_admin" ON ttg FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "ttg_delete_admin" ON ttg FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================
-- TRIGGER: Auto-create profile saat user register
-- ================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- SAMPLE DATA (Opsional)
-- ================================================

-- Kategori contoh
INSERT INTO categories (name, slug) VALUES
  ('Anyaman', 'anyaman'),
  ('Batik', 'batik'),
  ('Gerabah', 'gerabah'),
  ('Kayu Ukir', 'kayu-ukir'),
  ('Tenun', 'tenun')
ON CONFLICT (slug) DO NOTHING;

-- Posts contoh
INSERT INTO posts (title, slug, excerpt, content, category, published) VALUES
  ('Sosialisasi Teknologi Biogas untuk Peternak', 'sosialisasi-biogas', 'Posyantek mengadakan sosialisasi pemanfaatan biogas dari limbah ternak kepada kelompok peternak di wilayah kecamatan.', 'Konten lengkap sosialisasi biogas...', 'kegiatan', true),
  ('Pelatihan Pengolahan Sampah Organik Menjadi Kompos', 'pelatihan-kompos', 'Warga antusias mengikuti pelatihan pengolahan sampah organik menjadi pupuk kompos yang bernilai ekonomi.', 'Konten lengkap pelatihan kompos...', 'kegiatan', true),
  ('Kaji Tiru TTG Pompa Hidram ke Kabupaten Tetangga', 'kaji-tiru-hidram', 'Tim Posyantek melakukan kaji tiru teknologi pompa hidram yang berhasil diterapkan di Kabupaten Tetangga.', 'Konten lengkap kaji tiru hidram...', 'berita', true)
ON CONFLICT (slug) DO NOTHING;

-- TTG contoh
INSERT INTO ttg (name, description, bidang, cara_kerja) VALUES
  ('Biodigester Skala Rumah Tangga', 'Alat pengolah limbah organik (kotoran ternak/sampah dapur) menjadi biogas untuk memasak dan pupuk cair (bio-slurry).', 'energi', 'Limbah organik dimasukkan ke dalam tangki anaerob, bakteri mengurai bahan organik menghasilkan gas metana yang dapat digunakan sebagai bahan bakar.'),
  ('Pompa Hidram', 'Pompa air yang bekerja tanpa listrik, memanfaatkan energi kinetik aliran air dari sumber mata air untuk mengangkat air ke tempat yang lebih tinggi.', 'pertanian', 'Menggunakan prinsip water hammer — aliran air yang tiba-tiba dihentikan menciptakan tekanan yang memompa sebagian air ke reservoir.'),
  ('Mesin Pencacah Sampah Organik', 'Mesin untuk mencacah sampah organik (daun, ranting, sisa makanan) menjadi potongan kecil yang siap dikomposkan.', 'lingkungan', 'Motor penggerak memutar pisau cacah yang memotong material organik menjadi ukuran 1-3 cm, mempercepat proses dekomposisi kompos.')
ON CONFLICT DO NOTHING;

-- ================================================
-- CARA SET ADMIN:
-- Setelah register, jalankan perintah ini di SQL Editor:
-- UPDATE profiles SET role = 'admin' WHERE id = 'user-uuid-here';
-- ================================================
