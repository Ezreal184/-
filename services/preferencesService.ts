import { supabase } from './supabase';
import type { UserPreferences, PreferencesUpdate } from '../types/database';

// ============================================
// 偏好设置服务
// ============================================

/**
 * 获取当前用户的偏好设置
 */
export async function getPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('获取偏好设置失败:', error);
    return null;
  }

  return data;
}

/**
 * 更新当前用户的偏好设置
 */
export async function updatePreferences(updates: PreferencesUpdate): Promise<UserPreferences> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('未认证');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('更新偏好设置失败:', error);
    throw error;
  }

  return data;
}

/**
 * 重置偏好设置为默认值
 */
export async function resetPreferences(): Promise<UserPreferences> {
  const defaultPreferences: PreferencesUpdate = {
    notifications_enabled: true,
    safety_alerts: true,
    units: 'metric',
    auto_summary: true,
  };

  return updatePreferences(defaultPreferences);
}
