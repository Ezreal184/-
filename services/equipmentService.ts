import { supabase } from './supabase';
import type {
  Equipment,
  EquipmentWithReviews,
  EquipmentReview,
  ReviewCreate,
  CartItem,
  CartItemWithEquipment,
} from '../types/database';

// ============================================
// 装备服务
// ============================================

/**
 * 获取所有装备，可选按类别筛选
 */
export async function getEquipment(category?: string): Promise<Equipment[]> {
  let query = supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取装备列表失败:', error);
    throw error;
  }

  return data ?? [];
}

/**
 * 通过 ID 获取带评价的装备详情
 */
export async function getEquipmentDetail(equipmentId: string): Promise<EquipmentWithReviews | null> {
  const { data, error } = await supabase
    .from('equipment')
    .select(`
      *,
      equipment_reviews (
        *,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      )
    `)
    .eq('id', equipmentId)
    .single();

  if (error) {
    console.error('获取装备详情失败:', error);
    return null;
  }

  // 计算平均评分
  const reviews = data.equipment_reviews ?? [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : null;

  return {
    ...data,
    average_rating: averageRating,
    review_count: reviews.length,
  } as EquipmentWithReviews;
}

/**
 * 为装备添加评价
 */
export async function createReview(review: ReviewCreate): Promise<EquipmentReview> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('equipment_reviews')
    .insert({
      ...review,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('创建评价失败:', error);
    throw error;
  }

  return data;
}

/**
 * 更新评价
 */
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; comment?: string }
): Promise<EquipmentReview> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('equipment_reviews')
    .update(updates)
    .eq('id', reviewId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('更新评价失败:', error);
    throw error;
  }

  return data;
}

/**
 * 删除评价
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('equipment_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    console.error('删除评价失败:', error);
    throw error;
  }
}

// ============================================
// 购物车功能
// ============================================

/**
 * 获取当前用户的购物车项
 */
export async function getCartItems(): Promise<CartItemWithEquipment[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      equipment (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取购物车失败:', error);
    throw error;
  }

  return data as CartItemWithEquipment[];
}

/**
 * 添加商品到购物车
 */
export async function addToCart(equipmentId: string, quantity: number = 1): Promise<CartItem> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  // 检查是否已在购物车中
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('equipment_id', equipmentId)
    .maybeSingle();

  if (existing) {
    // 更新数量
    return updateCartItem(existing.id, existing.quantity + quantity);
  }

  // 添加新项
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      equipment_id: equipmentId,
      quantity,
    })
    .select()
    .single();

  if (error) {
    console.error('添加到购物车失败:', error);
    throw error;
  }

  return data;
}

/**
 * 更新购物车项数量
 */
export async function updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  if (quantity <= 0) {
    await removeFromCart(cartItemId);
    throw new Error('数量必须大于0，已从购物车移除');
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('更新购物车项失败:', error);
    throw error;
  }

  return data;
}

/**
 * 从购物车移除商品
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('移除购物车项失败:', error);
    throw error;
  }
}

/**
 * 清空整个购物车
 */
export async function clearCart(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('清空购物车失败:', error);
    throw error;
  }
}

/**
 * 获取购物车商品总数
 */
export async function getCartCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return 0;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', user.id);

  if (error) {
    console.error('获取购物车数量失败:', error);
    return 0;
  }

  return data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}
