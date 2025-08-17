-- Note: Storage policies must be configured through the Supabase Dashboard
-- Go to Storage > Policies in your Supabase Dashboard and configure the following policies:

/*
For the 'blog-images' bucket:

1. SELECT Policy (viewing images):
   - Name: "Allow public viewing of blog images"
   - Definition: bucket_id = 'blog-images'

2. INSERT Policy (uploading):
   - Name: "Allow authenticated users to upload blog images"
   - Definition: bucket_id = 'blog-images' and auth.role() = 'authenticated'

3. UPDATE Policy:
   - Name: "Allow authenticated users to update blog images"
   - Definition: bucket_id = 'blog-images' and auth.role() = 'authenticated'

4. DELETE Policy:
   - Name: "Allow authenticated users to delete blog images"
   - Definition: bucket_id = 'blog-images' and auth.role() = 'authenticated'
*/
