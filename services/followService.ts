import { supabase } from './supabase';
import type { Profile } from '../types/database';

// ============================================
// 关注服务
// ============================================

/**
 * 关注用户
 */
export async function followUser(userId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  if (user.id === userId) {
    throw new Error('不能关注自己');
  }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: userId,
    });

  if (error) {
    // 忽略重复关注错误
    if (error.code !== '23505') {
      console.error('关注失败:', error);
      throw error;
    }
  }
}

/**
 * 取消关注用户
 */
export async function unfollowUser(userId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) {
    console.error('取消关注失败:', error);
    throw error;
  }
}

/**
 * 检查当前用户是否正在关注某用户
 */
export async function isFollowing(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', userId)
    .maybeSingle();

  if (error) {
    console.error('检查关注状态失败:', error);
    return false;
  }

  return !!data;
}

/**
 * 获取用户的粉丝列表
 */
export async function getFollowers(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      profiles:follower_id (
        id,
        name,
        avatar_url,
        title,
        bio
      )
    `)
    .eq('following_id', userId);

  if (error) {
    console.error('获取粉丝列表失败:', error);
    throw error;
  }

  return data?.map(item => item.profiles as unknown as Profile) ?? [];
}

/**
 * 获取用户正在关注的人列表
 */
export async function getFollowing(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      profiles:following_id (
        id,
        name,
        avatar_url,
        title,
        bio
      )
    `)
    .eq('follower_id', userId);

  if (error) {
    console.error('获取关注列表失败:', error);
    throw error;
  }

  return data?.map(item => item.profiles as unknown as Profile) ?? [];
}

/**
 * 批量检查关注状态
 */
export async function getFollowStatuses(userIds: string[]): Promise<Record<string, boolean>> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || userIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)
    .in('following_id', userIds);

  if (error) {
    console.error('获取关注状态失败:', error);
    return {};
  }

  const followingSet = new Set(data?.map(f => f.following_id) ?? []);
  return userIds.reduce((acc, userId) => {
    acc[userId] = followingSet.has(userId);
    return acc;
  }, {} as Record<string, boolean>);
}
