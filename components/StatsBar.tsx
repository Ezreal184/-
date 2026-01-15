import React from 'react';
import { UserProfile } from '../types';

interface StatsBarProps {
  user: UserProfile;
}

const StatsBar: React.FC<StatsBarProps> = ({ user }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 grid grid-cols-3 gap-6 px-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
        <span className="text-3xl font-black text-primary dark:text-white font-display">{user.stats.climbs}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-sm text-zinc-400">landscape</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">攀登记录</span>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
        <span className="text-3xl font-black text-primary dark:text-white font-display">{user.stats.followers}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-sm text-zinc-400">group</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">关注者</span>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
        <span className="text-3xl font-black text-primary dark:text-white font-display">{user.stats.following}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-sm text-zinc-400">person_add</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">正在关注</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
