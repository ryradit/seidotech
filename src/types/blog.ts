export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published_at?: string | null
  created_at: string
  updated_at: string
  status: 'draft' | 'published'
  author: string
  category: 'Layanan' | 'Berita' | 'Tutorial' | 'Proyek'
}
