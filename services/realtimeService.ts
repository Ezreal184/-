import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Notification, Post } from '../types/database';

// ============================================
// 实时订阅服务
// ============================================

/**
 * 订阅新通知
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 订阅帖子更新（点赞、评论数变化）
 */
export function subscribeToPostUpdates(
  postId: string,
  callback: (post: Post) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`post:${postId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
        filter: `id=eq.${postId}`,
      },
      (payload) => {
        callback(payload.new as Post);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 订阅帖子的新评论
 */
export function subscribeToPostComments(
  postId: string,
  callback: (comment: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`comments:${postId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 订阅动态流的新帖子
 */
export function subscribeToFeed(
  callback: (post: Post) => void
): RealtimeChannel {
  const channel = supabase
    .channel('feed')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      (payload) => {
        callback(payload.new as Post);
      }
    )
    .subscribe();

  return channel;
}

/**
 * 取消订阅频道
 */
export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

/**
 * 取消所有订阅
 */
export function unsubscribeAll(): void {
  supabase.removeAllChannels();
}
