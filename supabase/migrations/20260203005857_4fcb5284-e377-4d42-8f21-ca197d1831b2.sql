-- Create storage bucket for temporary image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('temp-images', 'temp-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to temp-images bucket
CREATE POLICY "Authenticated users can upload temp images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'temp-images');

-- Allow public read access for temp images (needed for API)
CREATE POLICY "Public read access for temp images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'temp-images');

-- Allow authenticated users to delete their own temp images
CREATE POLICY "Users can delete their own temp images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'temp-images' AND auth.uid()::text = (storage.foldername(name))[1]);