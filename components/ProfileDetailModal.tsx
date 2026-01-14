
import React from 'react';
import { MOCK_USER } from '../constants';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const milestones = [
    { year: '2023', event: '成功挑战勃朗峰北壁', icon: 'landscape' },
    { year: '2022', event: '获得年度最佳高山摄影奖', icon: 'photo_camera' },
    { year: '2021', event: '完成珠穆朗玛峰南坡登顶', icon: 'ac_unit' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500">
        {/* 顶部背景 */}
        <div className="h-32 bg-primary relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-6 right-6 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-10 pb-10">
          <div className="relative -mt-16 flex items-end gap-6 mb-8">
            <div className="size-32 rounded-[2.5rem] border-8 border-white shadow-xl bg-cover bg-center bg-white" style={{ backgroundImage: `url(${MOCK_USER.avatarUrl})` }} />
            <div className="pb-2">
              <h2 className="text-3xl font-black font-display text-zinc-900">{MOCK_USER.name}</h2>
              <p className="text-primary font-bold">{MOCK_USER.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">探险家成就</h3>
                <div className="flex gap-3">
                  {['verified', 'workspace_premium', 'military_tech', 'emoji_events'].map((icon, i) => (
                    <div key={i} className="size-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary hover:scale-110 transition-transform cursor-help shadow-sm">
                      <span className="material-symbols-outlined fill-[1]">{icon}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">关于我</h3>
                <p className="text-zinc-600 leading-relaxed text-sm bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  {MOCK_USER.bio} 目前正专注于极地攀登技术的研究与高海拔影像记录。
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">生涯里程碑</h3>
                <div className="space-y-4">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">{m.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400">{m.year}</p>
                        <p className="text-xs font-bold text-zinc-800">{m.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        
        <div className="px-10 py-6 bg-zinc-50 border-t border-zinc-100 flex justify-center">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Alpine 认证阿尔卑斯登山家 ID: #8829-SC</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;
