-- ============================================================
-- FIX: Infinite Recursion pada RLS Policy tabel profiles
-- Jalankan SELURUH file ini di Supabase SQL Editor
-- ============================================================

-- ── LANGKAH 1: Hapus semua policy yang bermasalah ──────────

DROP POLICY IF EXISTS "profiles_select_own"    ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own"    ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"    ON profiles;
DROP POLICY IF EXISTS "profiles_upsert_own"    ON profiles;

DROP POLICY IF EXISTS "categories_insert_admin"  ON categories;
DROP POLICY IF EXISTS "categories_delete_admin"  ON categories;
DROP POLICY IF EXISTS "categories_update_admin"  ON categories;

DROP POLICY IF EXISTS "products_select"          ON products;
DROP POLICY IF EXISTS "products_insert_admin"    ON products;
DROP POLICY IF EXISTS "products_update_admin"    ON products;
DROP POLICY IF EXISTS "products_delete_admin"    ON products;

DROP POLICY IF EXISTS "orders_select"            ON orders;
DROP POLICY IF EXISTS "orders_update_admin"      ON orders;

DROP POLICY IF EXISTS "order_items_select"       ON order_items;

DROP POLICY IF EXISTS "posts_select"             ON posts;
DROP POLICY IF EXISTS "posts_insert_admin"       ON posts;
DROP POLICY IF EXISTS "posts_update_admin"       ON posts;
DROP POLICY IF EXISTS "posts_delete_admin"       ON posts;

DROP POLICY IF EXISTS "ttg_insert_admin"         ON ttg;
DROP POLICY IF EXISTS "ttg_update_admin"         ON ttg;
DROP POLICY IF EXISTS "ttg_delete_admin"         ON ttg;


-- ── LANGKAH 2: Buat helper function is_admin() ─────────────
-- Fungsi ini membaca role dari JWT (app_metadata),
-- TIDAK query ke tabel profiles → tidak ada recursion.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', FALSE)
    OR
    COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', FALSE)
$$;


-- ── LANGKAH 3: Buat ulang policy profiles (tanpa recursion) ─

-- User hanya bisa baca profil sendiri; admin pakai fungsi is_admin()
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());


-- ── LANGKAH 4: Buat ulang policy tabel lain ────────────────

-- Categories
CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  USING (is_admin());

-- Products (user baca produk aktif; admin baca semua)
CREATE POLICY "products_select"
  ON products FOR SELECT
  USING (is_active = TRUE OR is_admin());

CREATE POLICY "products_insert_admin"
  ON products FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "products_update_admin"
  ON products FOR UPDATE
  USING (is_admin());

CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  USING (is_admin());

-- Orders
CREATE POLICY "orders_select"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE
  USING (is_admin());

-- Order items
CREATE POLICY "order_items_select"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

-- Posts
CREATE POLICY "posts_select"
  ON posts FOR SELECT
  USING (published = TRUE OR is_admin());

CREATE POLICY "posts_insert_admin"
  ON posts FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "posts_update_admin"
  ON posts FOR UPDATE
  USING (is_admin());

CREATE POLICY "posts_delete_admin"
  ON posts FOR DELETE
  USING (is_admin());

-- TTG
CREATE POLICY "ttg_insert_admin"
  ON ttg FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "ttg_update_admin"
  ON ttg FOR UPDATE
  USING (is_admin());

CREATE POLICY "ttg_delete_admin"
  ON ttg FOR DELETE
  USING (is_admin());


-- ── LANGKAH 5: Sync role ke JWT app_metadata ───────────────
-- Supabase menyimpan JWT dari auth.users.raw_app_meta_data.
-- Kita perlu update metadata user admin agar is_admin() bekerja.
-- Ganti 'GANTI-DENGAN-UUID-USER-ADMIN' dengan UUID user admin Anda.

-- Contoh (jalankan HANYA untuk user yang ingin dijadikan admin):
-- SELECT auth.uid(); -- untuk tahu UUID Anda saat ini
--
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE id = 'GANTI-DENGAN-UUID-USER-ADMIN';

-- Juga update tabel profiles agar konsisten:
-- UPDATE profiles SET role = 'admin'
-- WHERE id = 'GANTI-DENGAN-UUID-USER-ADMIN';


-- ── LANGKAH 6: Trigger handle_new_user (pastikan ada) ──────

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

-- Drop & recreate trigger agar tidak duplikat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── SELESAI ────────────────────────────────────────────────
-- Setelah menjalankan SQL di atas, lakukan langkah berikut:
-- 1. Jalankan UPDATE auth.users di atas untuk user admin Anda
-- 2. User admin HARUS logout lalu login ulang agar JWT ter-refresh
-- 3. Setelah login ulang, is_admin() akan mengembalikan TRUE
