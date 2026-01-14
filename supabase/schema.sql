-- ============================================
-- Alpine Explorer (Summit Reach) - Supabase Schema
-- Run this file in the Supabase SQL Editor
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles: Extended user data linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  climbs_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts: User expedition posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  date DATE,
  image_url TEXT,
  alt_text TEXT,
  content TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes: Post like relationships
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comments: Post comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follows: User follow relationships
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Equipment: Gear catalog
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('五金', '服装', '安全', '背包')),
  image_url TEXT,
  description TEXT,
  gallery TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Reviews: User reviews on gear
CREATE TABLE IF NOT EXISTS public.equipment_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(equipment_id, user_id)
);

-- Cart Items: Shopping cart
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK(quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, equipment_id)
);

-- Notifications: User notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('safety', 'community', 'achievement', 'social')),
  title TEXT NOT NULL,
  body TEXT,
  icon TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences: App settings
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  safety_alerts BOOLEAN DEFAULT TRUE,
  units TEXT DEFAULT 'metric' CHECK(units IN ('metric', 'imperial')),
  auto_summary BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_reviews_equipment_id ON public.equipment_reviews(equipment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: profiles
-- ============================================

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================
-- RLS POLICIES: posts
-- ============================================

CREATE POLICY "posts_select_all" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "posts_insert_own" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: likes
-- ============================================

CREATE POLICY "likes_select_all" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "likes_insert_own" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes_delete_own" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: comments
-- ============================================

CREATE POLICY "comments_select_all" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_own" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: follows
-- ============================================

CREATE POLICY "follows_select_all" ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "follows_insert_own" ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows_delete_own" ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- RLS POLICIES: equipment
-- ============================================

CREATE POLICY "equipment_select_all" ON public.equipment
  FOR SELECT USING (true);

-- Equipment is managed by admins only (via service role key)

-- ============================================
-- RLS POLICIES: equipment_reviews
-- ============================================

CREATE POLICY "reviews_select_all" ON public.equipment_reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_auth" ON public.equipment_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own" ON public.equipment_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own" ON public.equipment_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: cart_items
-- ============================================

CREATE POLICY "cart_select_own" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_own" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_own" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_delete_own" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: notifications
-- ============================================

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES: user_preferences
-- ============================================

CREATE POLICY "preferences_select_own" ON public.user_preferences
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "preferences_insert_own" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "preferences_update_own" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = id);


-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Auto-create profile and preferences on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Explorer')
  );
  
  INSERT INTO public.user_preferences (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Execute on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update likes_count on posts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update likes count
DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Function: Update comments_count on posts
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update comments count
DROP TRIGGER IF EXISTS on_comment_change ON public.comments;
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Function: Create notification on new follower
CREATE OR REPLACE FUNCTION public.notify_new_follower()
RETURNS TRIGGER AS $$
DECLARE
  follower_name TEXT;
BEGIN
  SELECT name INTO follower_name FROM public.profiles WHERE id = NEW.follower_id;
  
  INSERT INTO public.notifications (user_id, type, title, body, icon)
  VALUES (
    NEW.following_id,
    'community',
    '新关注者',
    follower_name || ' 开始关注你了。',
    'person_add'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Notify on new follow
DROP TRIGGER IF EXISTS on_new_follow ON public.follows;
CREATE TRIGGER on_new_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_follower();

-- Function: Create notification on post like
CREATE OR REPLACE FUNCTION public.notify_post_like()
RETURNS TRIGGER AS $$
DECLARE
  liker_name TEXT;
  post_owner_id UUID;
  post_title TEXT;
BEGIN
  SELECT name INTO liker_name FROM public.profiles WHERE id = NEW.user_id;
  SELECT user_id, title INTO post_owner_id, post_title FROM public.posts WHERE id = NEW.post_id;
  
  -- Don't notify if user likes their own post
  IF NEW.user_id != post_owner_id THEN
    INSERT INTO public.notifications (user_id, type, title, body, icon)
    VALUES (
      post_owner_id,
      'social',
      '帖子获赞',
      liker_name || ' 点赞了您的帖子 "' || COALESCE(post_title, '无标题') || '"',
      'favorite'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Notify on post like
DROP TRIGGER IF EXISTS on_post_like ON public.likes;
CREATE TRIGGER on_post_like
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.notify_post_like();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- VIEWS (for convenience)
-- ============================================

-- View: Posts with author info
CREATE OR REPLACE VIEW public.posts_with_author AS
SELECT 
  p.*,
  pr.name as author_name,
  pr.avatar_url as author_avatar,
  pr.title as author_title
FROM public.posts p
JOIN public.profiles pr ON p.user_id = pr.id;

-- View: Profile stats
CREATE OR REPLACE VIEW public.profile_stats AS
SELECT 
  p.id,
  p.name,
  p.climbs_count,
  (SELECT COUNT(*) FROM public.follows WHERE following_id = p.id) as followers_count,
  (SELECT COUNT(*) FROM public.follows WHERE follower_id = p.id) as following_count,
  (SELECT COUNT(*) FROM public.posts WHERE user_id = p.id) as posts_count
FROM public.profiles p;

-- ============================================
-- STORAGE BUCKETS (run separately in Supabase Dashboard)
-- ============================================
-- Note: Storage buckets should be created via Supabase Dashboard or API
-- 
-- Bucket: avatars (public)
-- Bucket: banners (public)  
-- Bucket: posts (public)

-- ============================================
-- REALTIME (enable in Supabase Dashboard)
-- ============================================
-- Enable realtime for:
-- - notifications
-- - posts
-- - comments

-- ============================================
-- SEED DATA: Equipment Catalog
-- ============================================

INSERT INTO public.equipment (name, brand, price, category, image_url, description, gallery) VALUES
('Apex 超轻型冰镐', 'Alpine Forge', 2099.00, '五金', 
 'https://picsum.photos/800/800?random=50',
 '专为极致攀冰和技术型混合路线设计。Apex 采用航空级铝材手柄与精钢镐头，平衡性卓越，在硬冰中具有极强的穿透力。',
 ARRAY['https://picsum.photos/800/800?random=50', 'https://picsum.photos/800/800?random=150', 'https://picsum.photos/800/800?random=250']),

('Summit 硬壳夹克 V4', 'Peak Performance', 3849.00, '服装',
 'https://picsum.photos/800/800?random=51',
 '全天候保护。采用三层 GORE-TEX Pro 面料，提供顶级的防水透气性能。专为阿尔卑斯式登山设计的剪裁，不影响任何攀爬动作。',
 ARRAY['https://picsum.photos/800/800?random=51', 'https://picsum.photos/800/800?random=151', 'https://picsum.photos/800/800?random=251']),

('钛合金冰爪 X-Pro', 'GripMaster', 1289.00, '五金',
 'https://picsum.photos/400/400?random=52',
 '超轻钛合金材质，适用于技术型攀登和混合路线。',
 NULL),

('Oxygen 系统 Mini-Flow', 'SkyBreath', 8500.00, '安全',
 'https://picsum.photos/400/400?random=53',
 '高海拔氧气系统，轻量化设计，适用于8000米以上攀登。',
 NULL),

('太阳能充电远征背包', 'VoltTrail', 2340.00, '背包',
 'https://picsum.photos/400/400?random=54',
 '内置太阳能充电板，60L容量，适合长途远征。',
 NULL),

('GORE-TEX 保暖手套', 'FrostBane', 895.00, '服装',
 'https://picsum.photos/400/400?random=55',
 '防水透气，-40°C保暖性能，触屏兼容。',
 NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE
-- ============================================
