-- Create storage bucket for cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for covers bucket
CREATE POLICY "Cover images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'covers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'covers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'covers' 
  AND auth.role() = 'authenticated'
);
