-- =====================================================
-- TABEL BARU: gallery_items & mitra
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- Tabel Galeri
CREATE TABLE IF NOT EXISTS gallery_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  type       TEXT DEFAULT 'photo' CHECK (type IN ('photo', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Mitra
CREATE TABLE IF NOT EXISTS mitra (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  logo_url   TEXT,
  jenis      TEXT NOT NULL DEFAULT 'Lainnya',
  website    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mitra         ENABLE ROW LEVEL SECURITY;

-- Gallery: semua bisa baca, admin bisa CRUD
CREATE POLICY "gallery_select" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "gallery_insert" ON gallery_items FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "gallery_delete" ON gallery_items FOR DELETE USING (is_admin());

-- Mitra: semua bisa baca, admin bisa CRUD
CREATE POLICY "mitra_select" ON mitra FOR SELECT USING (true);
CREATE POLICY "mitra_insert" ON mitra FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "mitra_update" ON mitra FOR UPDATE USING (is_admin());
CREATE POLICY "mitra_delete" ON mitra FOR DELETE USING (is_admin());

-- =====================================================
-- CATATAN: Jalankan supabase-fix-rls.sql lebih dulu
-- agar fungsi is_admin() tersedia sebelum file ini.
-- =====================================================
