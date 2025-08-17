-- Policy for selecting (reading) images - Public access
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT 
USING (
  bucket_id = 'blog-images' AND 
  auth.role() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'blog-images' AND 
  auth.role() IS NOT NULL
);

-- Policy for inserting new images - Authenticated users only
CREATE POLICY "Authenticated Users Insert Access"
ON storage.objects
FOR INSERT
TO authenticated
USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated' AND
  (LOWER(mimetype) LIKE 'image/%') AND -- Only allow image files
  (octet_length(name) < 255) -- Limit filename length
);

-- Policy for updating images - Authenticated users only
CREATE POLICY "Authenticated Users Update Access"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated' AND
  (LOWER(mimetype) LIKE 'image/%') AND
  (octet_length(name) < 255)
);

-- Policy for deleting images - Authenticated users only
CREATE POLICY "Authenticated Users Delete Access"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated'
);
