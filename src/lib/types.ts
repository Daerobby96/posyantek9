export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string | null
  category_id: string | null
  is_active: boolean
  created_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_name?: string
  shipping_address: string
  shipping_city: string
  shipping_phone: string
  payment_method?: 'transfer' | 'cod'
  notes: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  role: 'user' | 'admin'
  created_at: string
}

/* ── Lembaga ── */
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_url: string | null
  category: 'berita' | 'kegiatan' | 'pengumuman'
  published: boolean
  created_at: string
}

export interface TTG {
  id: string
  name: string
  description: string | null
  image_url: string | null
  bidang: string
  cara_kerja: string | null
  created_at: string
}

export interface Layanan {
  id: string
  title: string
  description: string
  icon: string | null
  created_at: string
}

export interface Mitra {
  id: string
  name: string
  logo_url: string | null
  jenis: string
  website: string | null
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string
  url: string
  type: 'photo' | 'video'
  created_at: string
}

export interface Pengurus {
  id: string
  name: string
  jabatan: string
  foto_url: string | null
  urutan: number
}
