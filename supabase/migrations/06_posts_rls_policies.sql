-- Enable RLS on posts table (if not already enabled)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (published = true);

-- Policy: Authors can view their own posts (including drafts)
CREATE POLICY "Authors can view their own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = author_id);

-- Policy: Authors can create posts
CREATE POLICY "Authors can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Policy: Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);
