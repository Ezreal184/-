
import React, { useState } from 'react';

interface PublicProfileViewProps {
  user: {
    name: string;
    avatar: string;
    title: string;
    bio: string;
  };
  onBack: () => void;
  isLoggedIn: boolean;
}

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ user, onBack, isLoggedIn }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const MOCK_STATS = [
    { label: '登顶', value: '42' },
    { label: '粉丝', value: '12.4k' },
    { label: '正在关注', value: '342' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 封面背景 */}
      <div className="relative h-64 lg:h-80 w-full overflow-hidden bg-zinc-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
          style={{ backgroundImage: `url(${user.avatar})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
        
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 lg:left-20 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white/40 transition-all rounded-full"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          返回社区
        </button>
      </div>

      {/* 核心信息卡片 */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 -mt-24 relative z-10">
        <div className="bg-white dark:bg-zinc-900 shadow-2xl p-8 lg:p-12 border border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div 
              className="size-32 lg:size-44 rounded-none border-8 border-white dark:border-zinc-800 shadow-xl bg-cover bg-center" 
              style={{ backgroundImage: `url(${user.avatar})` }}
            />
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-4xl font-black font-display tracking-tight text-zinc-900 dark:text-white uppercase italic">{user.name}</h1>
                <span className="material-symbols-outlined text-primary dark:text-white fill-[1]">verified</span>
              </div>
              <p className="text-primary dark:text-zinc-400 font-bold text-sm tracking-widest uppercase mb-4">{user.title}</p>
              <div className="flex gap-8 justify-center md:justify-start">
                {MOCK_STATS.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={handleFollow}
                className={`flex-1 md:flex-none px-10 py-4 font-bold tracking-widest uppercase text-xs transition-all ${
                  isFollowing 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' 
                    : 'bg-primary dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95'
                }`}
              >
                {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
              </button>
              <button className="flex items-center justify-center size-12 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">探险简介</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic text-lg">
                "{user.bio} 作为一名经验丰富的登山者，我致力于探索地球上最后未受污染的巅峰，并倡导负责任的户外探险精神。"
              </p>
            </div>
            
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">技能认证</h3>
              <div className="flex flex-wrap gap-2">
                {['高海拔攀登', '冰川营救', '专业摄影', '气象分析'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 动态占位 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;
