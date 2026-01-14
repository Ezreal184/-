-- ============================================
-- 迁移 005: 行级安全 (RLS) 策略
-- ============================================

-- ============================================
-- 为所有表启用 RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles（用户档案）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

-- INSERT: 只能创建自己的档案
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: 只能更新自己的档案
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- DELETE: 只能删除自己的档案
CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================
-- posts（帖子）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "posts_select_all" ON posts
  FOR SELECT USING (true);

-- INSERT: 只能创建自己的帖子
CREATE POLICY "posts_insert_own" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 只能更新自己的帖子
CREATE POLICY "posts_update_own" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 只能删除自己的帖子
CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- likes（点赞）策略
-- ============================================

-- SELECT: 公开读取（用于计数）
CREATE POLICY "likes_select_all" ON likes
  FOR SELECT USING (true);

-- INSERT: 只能创建自己的点赞
CREATE POLICY "likes_insert_own" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- DELETE: 只能删除自己的点赞
CREATE POLICY "likes_delete_own" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- comments（评论）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (true);

-- INSERT: 只能创建自己的评论
CREATE POLICY "comments_insert_own" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 只能更新自己的评论
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 只能删除自己的评论
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- follows（关注）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "follows_select_all" ON follows
  FOR SELECT USING (true);

-- INSERT: 只能创建自己的关注
CREATE POLICY "follows_insert_own" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- DELETE: 只能删除自己的关注
CREATE POLICY "follows_delete_own" ON follows
  FOR DELETE USING (auth.uid() = follower_id);


-- ============================================
-- equipment（装备）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "equipment_select_all" ON equipment
  FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE: 仅管理员通过 service role
-- 普通用户无法修改装备数据
CREATE POLICY "equipment_insert_admin" ON equipment
  FOR INSERT WITH CHECK (false);

CREATE POLICY "equipment_update_admin" ON equipment
  FOR UPDATE USING (false);

CREATE POLICY "equipment_delete_admin" ON equipment
  FOR DELETE USING (false);

-- ============================================
-- equipment_reviews（装备评价）策略
-- ============================================

-- SELECT: 公开读取
CREATE POLICY "reviews_select_all" ON equipment_reviews
  FOR SELECT USING (true);

-- INSERT: 已认证用户可以创建评价
CREATE POLICY "reviews_insert_auth" ON equipment_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 只能更新自己的评价
CREATE POLICY "reviews_update_own" ON equipment_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 只能删除自己的评价
CREATE POLICY "reviews_delete_own" ON equipment_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- cart_items（购物车项）策略 - 私有数据
-- ============================================

-- SELECT: 只能查看自己的购物车
CREATE POLICY "cart_select_own" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: 只能添加到自己的购物车
CREATE POLICY "cart_insert_own" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: 只能更新自己的购物车项
CREATE POLICY "cart_update_own" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 只能删除自己的购物车项
CREATE POLICY "cart_delete_own" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- notifications（通知）策略 - 私有数据
-- ============================================

-- SELECT: 只能查看自己的通知
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: 仅系统/触发器可以创建通知（通过 SECURITY DEFINER 函数）
CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (false);

-- UPDATE: 只能更新自己的通知（标记已读）
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: 只能删除自己的通知
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- user_preferences（用户偏好设置）策略 - 私有数据
-- ============================================

-- SELECT: 只能查看自己的偏好设置
CREATE POLICY "preferences_select_own" ON user_preferences
  FOR SELECT USING (auth.uid() = id);

-- INSERT: 只能创建自己的偏好设置
CREATE POLICY "preferences_insert_own" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: 只能更新自己的偏好设置
CREATE POLICY "preferences_update_own" ON user_preferences
  FOR UPDATE USING (auth.uid() = id);
