export const POST_CATEGORIES = {
  LAYANAN: 'Layanan',
  PRODUK: 'Produk',
  PROYEK: 'Proyek',
  BERITA: 'Berita',
} as const;

export type PostCategory = typeof POST_CATEGORIES[keyof typeof POST_CATEGORIES];
