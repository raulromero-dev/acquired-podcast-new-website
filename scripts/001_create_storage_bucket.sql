-- Create a public storage bucket for episode images
INSERT INTO storage.buckets (id, name, public)
VALUES ('episode-images', 'episode-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'episode-images');

-- Allow authenticated uploads (we'll use service role key for admin uploads)
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'episode-images');

-- Allow authenticated updates
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'episode-images');

-- Allow authenticated deletes
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'episode-images');
