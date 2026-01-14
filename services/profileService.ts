import { supabase } from './supabase';
import type { Profile, ProfileUpdate, ProfileStats } from '../types/database';

// ============================================
// 档案服务
// ============================================

/**
 * 通过用户 ID 获取档案
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('获取档案失败:', error);
    return null;
  }

  return data;
}

/**
 * 获取当前用户的档案
 */
export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return getProfile(user.id);
}

/**
 * 更新当前用户的档案
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('更新档案失败:', error);
    throw error;
  }

  return data;
}

/**
 * 获取档案统计数据（粉丝数、关注数、帖子数）
 */
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  // 并行查询所有统计数据
  const [followersResult, followingResult, postsResult] = await Promise.all([
    supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', userId),
    supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', userId),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  return {
    followers_count: followersResult.count ?? 0,
    following_count: followingResult.count ?? 0,
    posts_count: postsResult.count ?? 0,
  };
}

/**
 * 上传头像图片
 */
export async function uploadAvatar(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('上传头像失败:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // 更新档案中的头像 URL
  await updateProfile({ avatar_url: publicUrl });

  return publicUrl;
}

/**
 * 上传横幅图片
 */
export async function uploadBanner(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `banners/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('banners')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('上传横幅失败:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('banners')
    .getPublicUrl(filePath);

  // 更新档案中的横幅 URL
  await updateProfile({ banner_url: publicUrl });

  return publicUrl;
}
