-- Create page_views table to track website visitors
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT
);

-- Create index for faster queries on timestamp
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- Enable row level security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from client
CREATE POLICY "Allow anonymous inserts" ON public.page_views
  FOR INSERT TO anon
  WITH CHECK (true);
  
-- Create policy to allow select for authenticated users only
CREATE POLICY "Allow authenticated select" ON public.page_views
  FOR SELECT TO authenticated
  USING (true);
