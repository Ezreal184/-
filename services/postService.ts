import { supabase } from './supabase';
import type {
  Post,
  PostWithAuthor,
  PostCreate,
  PostUpdate,
  CommentWithAuthor,
  CommentCreate,
  PaginatedResponse,
} from '../types/database';

// ============================================
// 帖子服务
// ============================================

/**
 * 获取带作者信息的分页社区动态帖子
 */
export async function getFeedPosts(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<PostWithAuthor>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar_url,
        title
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('获取动态失败:', error);
    throw error;
  }

  return {
    data: data as PostWithAuthor[],
    count: count ?? 0,
    hasMore: (count ?? 0) > to + 1,
  };
}

/**
 * 获取特定用户的帖子
 */
export async function getUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Post>> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('获取用户帖子失败:', error);
    throw error;
  }

  return {
    data: data ?? [],
    count: count ?? 0,
    hasMore: (count ?? 0) > to + 1,
  };
}

/**
 * 通过 ID 获取单个帖子
 */
export async function getPost(postId: string): Promise<PostWithAuthor | null> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar_url,
        title
      )
    `)
    .eq('id', postId)
    .single();

  if (error) {
    console.error('获取帖子失败:', error);
    return null;
  }

  return data as PostWithAuthor;
}

/**
 * 创建新帖子
 */
export async function createPost(post: PostCreate): Promise<Post> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('创建帖子失败:', error);
    throw error;
  }

  return data;
}

/**
 * 更新现有帖子
 */
export async function updatePost(postId: string, updates: PostUpdate): Promise<Post> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .eq('user_id', user.id) // 确保只能更新自己的帖子
    .select()
    .single();

  if (error) {
    console.error('更新帖子失败:', error);
    throw error;
  }

  return data;
}

/**
 * 删除帖子
 */
export async function deletePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id); // 确保只能删除自己的帖子

  if (error) {
    console.error('删除帖子失败:', error);
    throw error;
  }
}


// ============================================
// 点赞功能
// ============================================

/**
 * 点赞帖子
 */
export async function likePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      post_id: postId,
    });

  if (error) {
    // 忽略重复点赞错误
    if (error.code !== '23505') {
      console.error('点赞失败:', error);
      throw error;
    }
  }
}

/**
 * 取消点赞帖子
 */
export async function unlikePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('post_id', postId);

  if (error) {
    console.error('取消点赞失败:', error);
    throw error;
  }
}

/**
 * 检查当前用户是否已点赞帖子
 */
export async function hasLikedPost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (error) {
    console.error('检查点赞状态失败:', error);
    return false;
  }

  return !!data;
}

/**
 * 获取多个帖子的点赞状态（批量）
 */
export async function getLikeStatuses(postIds: string[]): Promise<Record<string, boolean>> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || postIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)
    .in('post_id', postIds);

  if (error) {
    console.error('获取点赞状态失败:', error);
    return {};
  }

  const likedPosts = new Set(data?.map(like => like.post_id) ?? []);
  return postIds.reduce((acc, postId) => {
    acc[postId] = likedPosts.has(postId);
    return acc;
  }, {} as Record<string, boolean>);
}

// ============================================
// 评论功能
// ============================================

/**
 * 获取帖子的评论
 */
export async function getPostComments(postId: string): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('获取评论失败:', error);
    throw error;
  }

  return data as CommentWithAuthor[];
}

/**
 * 为帖子添加评论
 */
export async function createComment(comment: CommentCreate): Promise<CommentWithAuthor> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...comment,
      user_id: user.id,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('创建评论失败:', error);
    throw error;
  }

  return data as CommentWithAuthor;
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id); // 确保只能删除自己的评论

  if (error) {
    console.error('删除评论失败:', error);
    throw error;
  }
}

/**
 * 上传帖子图片
 */
export async function uploadPostImage(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('posts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('上传图片失败:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('posts')
    .getPublicUrl(filePath);

  return publicUrl;
}
