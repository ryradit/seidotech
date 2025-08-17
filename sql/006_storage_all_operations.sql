-- Enable all operations for blog-images bucket

-- Allow all authenticated users to select/read files
create policy "Allow authenticated users to read blog images"
on storage.objects for select
using (
  bucket_id = 'blog-images' 
  and auth.role() = 'authenticated'
);

-- Allow all authenticated users to insert/upload files
create policy "Allow authenticated users to upload blog images"
on storage.objects for insert
with check (
  bucket_id = 'blog-images'
  and auth.role() = 'authenticated'
);

-- Allow all authenticated users to update files
create policy "Allow authenticated users to update blog images"
on storage.objects for update
using (
  bucket_id = 'blog-images'
  and auth.role() = 'authenticated'
);

-- Allow all authenticated users to delete files
create policy "Allow authenticated users to delete blog images"
on storage.objects for delete
using (
  bucket_id = 'blog-images'
  and auth.role() = 'authenticated'
);
