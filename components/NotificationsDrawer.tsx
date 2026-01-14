
import React, { useState, useEffect } from 'react';
import { getNotificationSummary } from '../services/geminiService';
import { 
  getNotifications, 
  markAllNotificationsRead,
  markNotificationRead 
} from '../services/notificationService';
import { subscribeToNotifications, unsubscribe } from '../services/realtimeService';
import { useAuth } from '../contexts/AuthContext';
import type { Notification } from '../types/database';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFICATIONS = [
  { id: '1', type: 'safety', title: '路线警示', body: '勃朗峰北壁发布新的雪崩预警。', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: 'warning', read: false, user_id: '' },
  { id: '2', type: 'community', title: '新关注者', body: 'Renan Ozturk 开始关注你了。', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: 'person_add', read: false, user_id: '' },
  { id: '3', type: 'achievement', title: '成功登顶！', body: '您已成功验证马特洪峰登顶记录。', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), icon: 'military_tech', read: false, user_id: '' },
  { id: '4', type: 'social', title: '帖子获赞', body: 'Jimmy Chin 和其他 14 人点赞了您的装备评测。', created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), icon: 'favorite', read: false, user_id: '' },
];

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return '刚刚';
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${diffDays}天前`;
};

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS as Notification[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchBriefing = async () => {
        setLoadingBriefing(true);
        const data = await getNotificationSummary();
        setBriefing(data);
        setLoadingBriefing(false);
      };
      fetchBriefing();
      
      // 获取真实通知
      const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
          const data = await getNotifications();
          if (data.length > 0) {
            setNotifications(data);
          }
        } catch (err) {
          console.error('获取通知失败:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [isOpen, user]);

  // 实时订阅新通知
  useEffect(() => {
    if (!user || !isOpen) return;
    
    const channel = subscribeToNotifications(user.id, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });
    
    return () => {
      unsubscribe(channel);
    };
  }, [user, isOpen]);

  const handleClearAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications([]);
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] animate-in slide-in-from-right duration-300 ease-out flex flex-col">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xl font-black font-display tracking-tight">通知中心</h3>
          <button onClick={onClose} className="size-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors">
            <span className="material-symbols-outlined text-zinc-500">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI 晨报 */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
              <span className="text-[10px] font-black uppercase tracking-widest">高山晨报</span>
            </div>
            {loadingBriefing ? (
              <div className="space-y-2">
                <div className="h-2 bg-primary/10 rounded w-full"></div>
                <div className="h-2 bg-primary/10 rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                "{briefing}"
              </p>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-zinc-400">progress_activity</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((note) => (
                <div 
                  key={note.id} 
                  className="flex gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group"
                  onClick={() => handleMarkRead(note.id)}
                >
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                    note.type === 'safety' ? 'bg-red-50 text-red-500' :
                    note.type === 'achievement' ? 'bg-amber-50 text-amber-500' :
                    'bg-zinc-100 text-zinc-500'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{note.icon || 'notifications'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-sm font-bold text-zinc-900 leading-none">{note.title}</h4>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">{formatTimeAgo(note.created_at)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-normal">{note.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-300">
                <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                <p className="text-sm font-bold uppercase tracking-widest">全部已读</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100">
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            标记全部为已读
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
