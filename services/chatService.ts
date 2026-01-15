import { supabase } from './supabase';
import type { ChatContact, Message } from '../types';

// ============================================
// 聊天联系人管理
// ============================================

/**
 * 获取用户的聊天联系人列表
 */
export async function getChatContacts(userId: string): Promise<ChatContact[]> {
  const { data, error } = await supabase
    .from('chat_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_time', { ascending: false });

  if (error) {
    console.error('获取聊天联系人失败:', error);
    throw error;
  }

  return data.map(contact => ({
    id: contact.id,
    name: contact.contact_name,
    avatar: contact.contact_avatar || '',
    lastMessage: contact.last_message || '',
    status: contact.status as 'online' | 'offline' | 'climbing',
    isAI: contact.is_ai
  }));
}

/**
 * 添加聊天联系人
 */
export async function addChatContact(
  userId: string,
  contactData: {
    contactId?: string;
    contactName: string;
    contactAvatar?: string;
    isAI?: boolean;
    status?: 'online' | 'offline' | 'climbing';
  }
): Promise<ChatContact> {
  const { data, error } = await supabase
    .from('chat_contacts')
    .insert({
      user_id: userId,
      contact_id: contactData.contactId,
      contact_name: contactData.contactName,
      contact_avatar: contactData.contactAvatar,
      is_ai: contactData.isAI || false,
      status: contactData.status || 'offline'
    })
    .select()
    .single();

  if (error) {
    console.error('添加聊天联系人失败:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.contact_name,
    avatar: data.contact_avatar || '',
    lastMessage: data.last_message || '',
    status: data.status as 'online' | 'offline' | 'climbing',
    isAI: data.is_ai
  };
}

/**
 * 更新联系人状态
 */
export async function updateContactStatus(
  contactId: string,
  status: 'online' | 'offline' | 'climbing'
): Promise<void> {
  const { error } = await supabase
    .from('chat_contacts')
    .update({ status })
    .eq('id', contactId);

  if (error) {
    console.error('更新联系人状态失败:', error);
    throw error;
  }
}

// ============================================
// 消息管理
// ============================================

/**
 * 获取与特定联系人的消息历史
 */
export async function getMessages(contactId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      text,
      is_ai,
      created_at,
      profiles:sender_id (name, avatar_url)
    `)
    .eq('contact_id', contactId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('获取消息历史失败:', error);
    throw error;
  }

  return data.map(msg => ({
    id: msg.id,
    senderId: msg.sender_id,
    text: msg.text,
    timestamp: new Date(msg.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    isAI: msg.is_ai
  }));
}

/**
 * 发送消息
 */
export async function sendMessage(
  senderId: string,
  contactId: string,
  text: string,
  receiverId?: string,
  isAI: boolean = false
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      contact_id: contactId,
      text,
      is_ai: isAI
    })
    .select()
    .single();

  if (error) {
    console.error('发送消息失败:', error);
    throw error;
  }

  return {
    id: data.id,
    senderId: data.sender_id,
    text: data.text,
    timestamp: new Date(data.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    isAI: data.is_ai
  };
}

/**
 * 删除消息
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    console.error('删除消息失败:', error);
    throw error;
  }
}

// ============================================
// AI 聊天助手
// ============================================

/**
 * 初始化 AI 聊天联系人
 */
export async function initializeAIContacts(userId: string): Promise<void> {
  const aiContacts = [
    {
      contactName: 'Basecamp AI',
      contactAvatar: 'https://images.unsplash.com/photo-1675429159040-34825946c77a?auto=format&fit=crop&q=80&w=200',
      isAI: true,
      status: 'online' as const
    }
  ];

  for (const contact of aiContacts) {
    try {
      // 检查是否已存在
      const { data: existing } = await supabase
        .from('chat_contacts')
        .select('id')
        .eq('user_id', userId)
        .eq('contact_name', contact.contactName)
        .eq('is_ai', true)
        .single();

      if (!existing) {
        await addChatContact(userId, contact);
      }
    } catch (error) {
      console.error('初始化 AI 联系人失败:', error);
    }
  }
}