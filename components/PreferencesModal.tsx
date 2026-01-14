
import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../services/preferencesService';
import { useAuth } from '../contexts/AuthContext';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    notifications: true,
    safetyAlerts: true,
    units: 'metric', // metric or imperial
    autoSummary: true,
  });

  // 加载用户偏好设置
  useEffect(() => {
    if (isOpen && user) {
      const loadPrefs = async () => {
        setLoading(true);
        try {
          const data = await getPreferences();
          if (data) {
            setPrefs({
              notifications: data.notifications_enabled,
              safetyAlerts: data.safety_alerts,
              units: data.units,
              autoSummary: data.auto_summary,
            });
          }
        } catch (err) {
          console.error('加载偏好设置失败:', err);
        } finally {
          setLoading(false);
        }
      };
      loadPrefs();
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        notifications_enabled: prefs.notifications,
        safety_alerts: prefs.safetyAlerts,
        units: prefs.units as 'metric' | 'imperial',
        auto_summary: prefs.autoSummary,
      });
      onClose();
    } catch (err) {
      console.error('保存偏好设置失败:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-primary' : 'bg-zinc-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h2 className="text-2xl font-black font-display tracking-tight">个人偏好</h2>
          <button onClick={onClose} className="size-10 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <span className="material-symbols-outlined text-zinc-500">close</span>
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {/* 通知设置 */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">通知与提醒</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                <div>
                  <p className="font-bold text-zinc-800">推送通知</p>
                  <p className="text-xs text-zinc-500">接收点赞、关注和社区互动通知</p>
                </div>
                <Toggle active={prefs.notifications} onClick={() => setPrefs({...prefs, notifications: !prefs.notifications})} />
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                <div>
                  <p className="font-bold text-zinc-800">安全预警</p>
                  <p className="text-xs text-zinc-500">接收您感兴趣区域的雪崩和天气警报</p>
                </div>
                <Toggle active={prefs.safetyAlerts} onClick={() => setPrefs({...prefs, safetyAlerts: !prefs.safetyAlerts})} />
              </div>
            </div>
          </section>

          {/* 计量单位 */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">计量单位</h3>
            <div className="flex p-1 bg-zinc-100 rounded-2xl">
              <button 
                onClick={() => setPrefs({...prefs, units: 'metric'})}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${prefs.units === 'metric' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500'}`}
              >
                公制 (米/摄氏度)
              </button>
              <button 
                onClick={() => setPrefs({...prefs, units: 'imperial'})}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${prefs.units === 'imperial' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500'}`}
              >
                英制 (英尺/华氏度)
              </button>
            </div>
          </section>

          {/* AI 功能 */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">AI 增强</h3>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-primary/10">
              <div>
                <p className="font-bold text-zinc-800">自动每日简报</p>
                <p className="text-xs text-zinc-500">每天早上由 Gemini 生成山岳情报摘要</p>
              </div>
              <Toggle active={prefs.autoSummary} onClick={() => setPrefs({...prefs, autoSummary: !prefs.autoSummary})} />
            </div>
          </section>
        </div>

        <div className="p-8 bg-zinc-50/50 border-t border-zinc-100 flex gap-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                保存中...
              </>
            ) : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
