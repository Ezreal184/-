import { supabase } from './supabase';
import type { Comment } from '../types';

// ============================================
// 评论管理
// ============================================

/**
 * 获取帖子的评论列表（包含嵌套回复）
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  // 获取顶级评论
  const { data: topLevelComments, error: topError } = await supabase
    .from('comments')
    .select(`
      id,
      user_id,
      content,
      likes_count,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (topError) {
    console.error('获取顶级评论失败:', topError);
    throw topError;
  }

  // 获取所有回复
  const { data: replies, error: repliesError } = await supabase
    .from('comments')
    .select(`
      id,
      user_id,
      parent_id,
      content,
      likes_count,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .eq('post_id', postId)
    .not('parent_id', 'is', null)
    .order('created_at', { ascending: true });

  if (repliesError) {
    console.error('获取回复失败:', repliesError);
    throw repliesError;
  }

  // 组织嵌套结构
  const commentsMap = new Map<string, Comment>();
  
  // 处理顶级评论
  topLevelComments.forEach(comment => {
    const profiles = comment.profiles as any;
    commentsMap.set(comment.id, {
      id: comment.id,
      userId: comment.user_id,
      userName: profiles?.name || '匿名用户',
      userAvatar: profiles?.avatar_url || '',
      postId,
      content: comment.content,
      likesCount: comment.likes_count || 0,
      createdAt: new Date(comment.created_at).toLocaleString('zh-CN'),
      replies: []
    });
  });

  // 处理回复
  replies.forEach(reply => {
    const profiles = reply.profiles as any;
    const replyComment: Comment = {
      id: reply.id,
      userId: reply.user_id,
      userName: profiles?.name || '匿名用户',
      userAvatar: profiles?.avatar_url || '',
      postId,
      parentId: reply.parent_id,
      content: reply.content,
      likesCount: reply.likes_count || 0,
      createdAt: new Date(reply.created_at).toLocaleString('zh-CN')
    };

    const parentComment = commentsMap.get(reply.parent_id);
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(replyComment);
    }
  });

  return Array.from(commentsMap.values());
}

/**
 * 创建评论
 */
export async function createComment(
  userId: string,
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      post_id: postId,
      parent_id: parentId,
      content
    })
    .select(`
      id,
      user_id,
      post_id,
      parent_id,
      content,
      likes_count,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .single();

  if (error) {
    console.error('创建评论失败:', error);
    throw error;
  }

  const profiles = data.profiles as any;
  return {
    id: data.id,
    userId: data.user_id,
    userName: profiles?.name || '匿名用户',
    userAvatar: profiles?.avatar_url || '',
    postId: data.post_id,
    parentId: data.parent_id,
    content: data.content,
    likesCount: data.likes_count || 0,
    createdAt: new Date(data.created_at).toLocaleString('zh-CN')
  };
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
}

/**
 * 点赞/取消点赞评论
 */
export async function toggleCommentLike(commentId: string, userId: string): Promise<boolean> {
  // 检查是否已点赞
  const { data: existingLike, error: checkError } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('检查点赞状态失败:', checkError);
    throw checkError;
  }

  if (existingLike) {
    // 取消点赞
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      console.error('取消点赞失败:', error);
      throw error;
    }
    return false;
  } else {
    // 添加点赞
    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: userId
      });

    if (error) {
      console.error('点赞失败:', error);
      throw error;
    }
    return true;
  }
}

/**
 * 获取用户对评论的点赞状态
 */
export async function getUserCommentLikes(commentIds: string[], userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('comment_likes')
    .select('comment_id')
    .in('comment_id', commentIds)
    .eq('user_id', userId);

  if (error) {
    console.error('获取用户点赞状态失败:', error);
    throw error;
  }

  return new Set(data.map(like => like.comment_id));
}

/**
 * 更新评论内容
 */
export async function updateComment(
  commentId: string,
  userId: string,
  content: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select(`
      id,
      user_id,
      post_id,
      parent_id,
      content,
      likes_count,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .single();

  if (error) {
    console.error('更新评论失败:', error);
    throw error;
  }

  const profiles = data.profiles as any;
  return {
    id: data.id,
    userId: data.user_id,
    userName: profiles?.name || '匿名用户',
    userAvatar: profiles?.avatar_url || '',
    postId: data.post_id,
    parentId: data.parent_id,
    content: data.content,
    likesCount: data.likes_count || 0,
    createdAt: new Date(data.created_at).toLocaleString('zh-CN')
  };
}