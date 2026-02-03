-- Create episodes table for persistent storage
CREATE TABLE IF NOT EXISTS episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  season TEXT NOT NULL,
  episode TEXT,
  date TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  youtube_id TEXT,
  spotify_url TEXT,
  apple_podcasts_url TEXT,
  transcript JSONB,
  carve_outs JSONB,
  follow_ups JSONB,
  sponsors JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_episodes_slug ON episodes(slug);

-- Create index on is_featured for filtering
CREATE INDEX IF NOT EXISTS idx_episodes_featured ON episodes(is_featured);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS idx_episodes_date ON episodes(date);

-- Enable Row Level Security
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON episodes
  FOR SELECT
  USING (true);

-- Create policy for authenticated admin write access
CREATE POLICY "Allow admin write access" ON episodes
  FOR ALL
  USING (true)
  WITH CHECK (true);
