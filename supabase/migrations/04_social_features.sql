-- Migration: Add Social Features and Enhanced Profiles
-- Created: 2025-12-07

-- =====================================================
-- 1. COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- =====================================================
-- 2. USER FOLLOWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Indexes for follows
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- =====================================================
-- 3. BOOKMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Indexes for bookmarks
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- =====================================================
-- 4. USER STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_views INT DEFAULT 0,
  total_posts INT DEFAULT 0,
  total_comments INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  days_active INT DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user stats
CREATE INDEX idx_user_stats_days_active ON user_stats(days_active DESC);

-- =====================================================
-- 5. UPDATE PROFILES TABLE
-- =====================================================
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- =====================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Comments RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);

-- User Follows RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON user_follows;
CREATE POLICY "Follows are viewable by everyone" 
  ON user_follows FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON user_follows;
CREATE POLICY "Users can follow others" 
  ON user_follows FOR INSERT 
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
CREATE POLICY "Users can unfollow" 
  ON user_follows FOR DELETE 
  USING (auth.uid() = follower_id);

-- Bookmarks RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON bookmarks;
CREATE POLICY "Users can view own bookmarks" 
  ON bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create bookmarks" ON bookmarks;
CREATE POLICY "Users can create bookmarks" 
  ON bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;
CREATE POLICY "Users can delete own bookmarks" 
  ON bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- User Stats RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Stats are viewable by everyone" ON user_stats;
CREATE POLICY "Stats are viewable by everyone" 
  ON user_stats FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
CREATE POLICY "Users can update own stats" 
  ON user_stats FOR UPDATE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to increment days active
CREATE OR REPLACE FUNCTION increment_days_active(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_stats (user_id, days_active, last_active_date)
  VALUES (p_user_id, 1, CURRENT_DATE)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    days_active = user_stats.days_active + 1,
    last_active_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comment count for a post
CREATE OR REPLACE FUNCTION get_comment_count(p_post_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT 
  FROM comments 
  WHERE post_id = p_post_id;
$$ LANGUAGE sql STABLE;

-- Function to get follower count
CREATE OR REPLACE FUNCTION get_follower_count(p_user_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT 
  FROM user_follows 
  WHERE following_id = p_user_id;
$$ LANGUAGE sql STABLE;

-- Function to get following count
CREATE OR REPLACE FUNCTION get_following_count(p_user_id UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT 
  FROM user_follows 
  WHERE follower_id = p_user_id;
$$ LANGUAGE sql STABLE;

-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- Update comment count when comment is added/deleted
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_stats 
    SET total_comments = total_comments + 1 
    WHERE user_id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_stats 
    SET total_comments = total_comments - 1 
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_stats_updated_at
BEFORE UPDATE ON user_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
