-- ============================================
-- SYNTACTIC DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================
-- TABLES
-- ============================================

-- 1. User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  display_name TEXT CHECK (char_length(display_name) <= 50),
  bio TEXT CHECK (char_length(bio) <= 500),
  avatar_url TEXT,
  website_url TEXT,
  github_username TEXT,
  twitter_username TEXT,
  private_key_hash TEXT UNIQUE NOT NULL,
  recovery_email TEXT,
  key_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Preferences
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  editor_theme TEXT DEFAULT 'vs-dark' CHECK (editor_theme IN ('vs-dark', 'vs-light', 'hc-black', 'github-dark', 'monokai', 'dracula')),
  editor_font_size INTEGER DEFAULT 14 CHECK (editor_font_size BETWEEN 10 AND 24),
  editor_font_family TEXT DEFAULT 'Fira Code',
  reading_mode TEXT DEFAULT 'light' CHECK (reading_mode IN ('light', 'dark', 'auto')),
  code_theme TEXT DEFAULT 'dracula',
  email_notifications BOOLEAN DEFAULT true,
  show_line_numbers BOOLEAN DEFAULT true,
  auto_save BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Series/Collections
CREATE TABLE public.series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  description TEXT CHECK (char_length(description) <= 500),
  slug TEXT UNIQUE NOT NULL CHECK (char_length(slug) >= 3),
  cover_image TEXT,
  is_public BOOLEAN DEFAULT true,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  series_order INTEGER,
  slug TEXT UNIQUE NOT NULL CHECK (char_length(slug) >= 3),
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  excerpt TEXT CHECK (char_length(excerpt) <= 300),
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time INTEGER,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 5. Code Embeds (in blog posts)
CREATE TABLE public.code_embeds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  embed_id TEXT NOT NULL,
  title TEXT,
  description TEXT,
  language TEXT NOT NULL CHECK (language IN ('javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'html', 'css')),
  code TEXT NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  show_output BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, embed_id)
);

-- 6. Standalone Code Files (Playground)
CREATE TABLE public.code_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  filename TEXT NOT NULL CHECK (char_length(filename) >= 1 AND char_length(filename) <= 100),
  language TEXT NOT NULL CHECK (language IN ('javascript', 'typescript', 'python', 'java', 'cpp', 'c')),
  code TEXT NOT NULL,
  description TEXT CHECK (char_length(description) <= 500),
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  fork_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  forked_from UUID REFERENCES public.code_files(id) ON DELETE SET NULL,
  folder_path TEXT DEFAULT '/',
  expires_at TIMESTAMPTZ,
  last_executed_at TIMESTAMPTZ,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Code Execution History
CREATE TABLE public.code_executions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_id UUID REFERENCES public.code_files(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  language TEXT NOT NULL,
  exit_code INTEGER,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Comments
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  is_edited BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Post Reactions (Likes & Bookmarks)
CREATE TABLE public.post_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'bookmark')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- 10. Comment Reactions
CREATE TABLE public.comment_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 11. Newsletter Subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subscribed BOOLEAN DEFAULT true,
  verification_token TEXT UNIQUE,
  verified BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- 12. Post Views
CREATE TABLE public.post_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Tags
CREATE TABLE public.tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Following System
CREATE TABLE public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 15. Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('comment', 'like', 'follow', 'mention', 'reply')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- Posts
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_published ON public.posts(published, published_at DESC);
CREATE INDEX idx_posts_author_published ON public.posts(author_id, published, published_at DESC);
CREATE INDEX idx_posts_series ON public.posts(series_id, series_order);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX idx_posts_featured ON public.posts(featured) WHERE featured = true;
CREATE INDEX idx_posts_search_gin ON public.posts USING GIN(to_tsvector('english', title || ' ' || content));

-- Series
CREATE INDEX idx_series_author ON public.series(author_id);
CREATE INDEX idx_series_slug ON public.series(slug);

-- Code Files
CREATE INDEX idx_code_files_user ON public.code_files(user_id);
CREATE INDEX idx_code_files_session ON public.code_files(session_id);
CREATE INDEX idx_code_files_folder_path ON public.code_files(user_id, folder_path);
CREATE INDEX idx_code_files_expires ON public.code_files(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_code_files_public ON public.code_files(is_public) WHERE is_public = true;
CREATE INDEX idx_code_files_language ON public.code_files(language);

-- Comments
CREATE INDEX idx_comments_post ON public.comments(post_id, created_at DESC);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_user_created ON public.comments(user_id, created_at DESC);
CREATE INDEX idx_comments_parent ON public.comments(parent_id) WHERE parent_id IS NOT NULL;

-- Reactions
CREATE INDEX idx_post_reactions_post ON public.post_reactions(post_id);
CREATE INDEX idx_post_reactions_user ON public.post_reactions(user_id);
CREATE INDEX idx_comment_reactions_comment ON public.comment_reactions(comment_id);

-- Views
CREATE INDEX idx_post_views_post ON public.post_views(post_id, viewed_at DESC);

-- Follows
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_series_updated_at BEFORE UPDATE ON public.series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_files_updated_at BEFORE UPDATE ON public.code_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Increment post view count
CREATE OR REPLACE FUNCTION increment_post_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_post_views_trigger AFTER INSERT ON public.post_views
  FOR EACH ROW EXECUTE FUNCTION increment_post_views();

-- Function: Update post reaction counts
CREATE OR REPLACE FUNCTION update_post_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.reaction_type = 'bookmark' THEN
      UPDATE public.posts SET bookmark_count = bookmark_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE public.posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    ELSIF OLD.reaction_type = 'bookmark' THEN
      UPDATE public.posts SET bookmark_count = bookmark_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_reaction_counts_trigger
AFTER INSERT OR DELETE ON public.post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_reaction_counts();

-- Function: Update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_counts_trigger
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Function: Update series post count
CREATE OR REPLACE FUNCTION update_series_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.series_id IS NOT NULL THEN
    UPDATE public.series SET post_count = post_count + 1 WHERE id = NEW.series_id;
  ELSIF TG_OP = 'DELETE' AND OLD.series_id IS NOT NULL THEN
    UPDATE public.series SET post_count = post_count - 1 WHERE id = OLD.series_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.series_id IS NOT NULL AND NEW.series_id IS NULL THEN
      UPDATE public.series SET post_count = post_count - 1 WHERE id = OLD.series_id;
    ELSIF OLD.series_id IS NULL AND NEW.series_id IS NOT NULL THEN
      UPDATE public.series SET post_count = post_count + 1 WHERE id = NEW.series_id;
    ELSIF OLD.series_id != NEW.series_id THEN
      UPDATE public.series SET post_count = post_count - 1 WHERE id = OLD.series_id;
      UPDATE public.series SET post_count = post_count + 1 WHERE id = NEW.series_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_series_post_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_series_post_count();

-- Function: Create user preferences on profile creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Function: Set expires_at for anonymous code files
CREATE OR REPLACE FUNCTION set_code_file_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.expires_at IS NULL THEN
    NEW.expires_at := NOW() + INTERVAL '1 hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_code_file_expiry_trigger
BEFORE INSERT ON public.code_files
FOR EACH ROW EXECUTE FUNCTION set_code_file_expiry();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, users can update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Preferences: Users can only see/update own
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Series: Public read if public, authors manage own
CREATE POLICY "Public series viewable by everyone" ON public.series FOR SELECT USING (is_public = true OR auth.uid() = author_id);
CREATE POLICY "Authors can insert own series" ON public.series FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own series" ON public.series FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own series" ON public.series FOR DELETE USING (auth.uid() = author_id);

-- Posts: Public read for published, authors manage own
CREATE POLICY "Published posts viewable by everyone" ON public.posts FOR SELECT USING (published = true OR auth.uid() = author_id);
CREATE POLICY "Authors can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Code Embeds: Viewable with post
CREATE POLICY "Code embeds viewable with post" ON public.code_embeds FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = code_embeds.post_id
    AND (posts.published = true OR posts.author_id = auth.uid())
  )
);
CREATE POLICY "Authors can manage code embeds" ON public.code_embeds FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = code_embeds.post_id
    AND posts.author_id = auth.uid()
  )
);

-- Code Files: Public files viewable by all, users manage own
CREATE POLICY "Public code files viewable by everyone" ON public.code_files FOR SELECT USING (
  is_public = true OR auth.uid() = user_id
);
CREATE POLICY "Users can insert code files" ON public.code_files FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Users can update own code files" ON public.code_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own code files" ON public.code_files FOR DELETE USING (auth.uid() = user_id);

-- Code Executions: Users can view own
CREATE POLICY "Users can view own executions" ON public.code_executions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert executions" ON public.code_executions FOR INSERT WITH CHECK (true);

-- Comments: Public read, users manage own
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Post Reactions: Public read, users manage own
CREATE POLICY "Reactions viewable by everyone" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON public.post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.post_reactions FOR DELETE USING (auth.uid() = user_id);

-- Comment Reactions: Public read, users manage own
CREATE POLICY "Comment reactions viewable by everyone" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own comment reactions" ON public.comment_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment reactions" ON public.comment_reactions FOR DELETE USING (auth.uid() = user_id);

-- Post Views: Anyone can insert, users can view own
CREATE POLICY "Anyone can insert post views" ON public.post_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own views" ON public.post_views FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Follows: Public read, users manage own
CREATE POLICY "Follows viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can insert own follows" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Notifications: Users can only see own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert some default tags
INSERT INTO public.tags (name, slug) VALUES
  ('JavaScript', 'javascript'),
  ('TypeScript', 'typescript'),
  ('Python', 'python'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('Node.js', 'nodejs'),
  ('Algorithms', 'algorithms'),
  ('Web Development', 'web-development'),
  ('Database', 'database'),
  ('DevOps', 'devops')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now ready for Syntactic!
-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard
-- 2. Setup scheduled job for cleanup (see below)
-- ============================================

/*
SCHEDULED JOB TO CREATE IN SUPABASE:

1. Go to Database > Cron Jobs
2. Create new job:
   - Name: cleanup-expired-files
   - Schedule: 0 * * * * (every hour)
   - SQL: DELETE FROM public.code_files WHERE expires_at < NOW() AND user_id IS NULL;
*/
