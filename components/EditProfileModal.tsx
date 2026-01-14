
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { getMyProfile, updateProfile, uploadAvatar } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: MOCK_USER.name,
    title: MOCK_USER.title,
    bio: MOCK_USER.bio,
  });

  // 头像预览状态
  const [previewAvatar, setPreviewAvatar] = useState(MOCK_USER.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载用户档案
  useEffect(() => {
    if (isOpen && user) {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const profile = await getMyProfile();
          if (profile) {
            setFormData({
              name: profile.name,
              title: profile.title || '',
              bio: profile.bio || '',
            });
            if (profile.avatar_url) {
              setPreviewAvatar(profile.avatar_url);
            }
          }
        } catch (err) {
          console.error('加载档案失败:', err);
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }
  }, [isOpen, user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建本地预览链接
      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl);
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 如果有新头像，先上传
      if (avatarFile) {
        setUploading(true);
        await uploadAvatar(avatarFile);
        setUploading(false);
      }
      
      // 更新档案信息
      await updateProfile({
        name: formData.name,
        title: formData.title || null,
        bio: formData.bio || null,
      });
      
      onClose();
    } catch (err) {
      console.error('保存档案失败:', err);
    } finally {
      setSaving(false);
      setAvatarFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 dark:bg-zinc-900">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-2xl font-black font-display tracking-tight dark:text-white">编辑资料</h2>
          <button onClick={onClose} className="size-10 rounded-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-zinc-500">close</span>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {/* 隐藏的文件输入框 */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <div 
                className="size-24 lg:size-28 rounded-full bg-cover bg-center border-4 border-white dark:border-zinc-800 shadow-lg transition-transform duration-300 group-hover:scale-105" 
                style={{ backgroundImage: `url(${previewAvatar})` }}
              />
              
              {/* 悬停时的相机图标蒙层 */}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">更换照片</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">姓名</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all font-medium"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">专业头衔</label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 ml-1">个人简介</label>
              <textarea 
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl px-5 py-4 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all font-medium resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-zinc-500 font-bold hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary dark:bg-white dark:text-black text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                {uploading ? '上传中...' : '保存中...'}
              </>
            ) : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
