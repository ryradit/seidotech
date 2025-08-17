-- Add categories column to posts table
alter table public.posts
add column category text not null default 'Layanan'
check (category in ('Layanan', 'Produk', 'Proyek', 'Berita'));

-- Update existing posts to have the default category
update public.posts set category = 'Layanan' where category is null;
