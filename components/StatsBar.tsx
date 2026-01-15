import React from 'react';
import { UserProfile } from '../types';

interface StatsBarProps {
  user: UserProfile;
}

const StatsBar: React.FC<StatsBarProps> = ({ user }) => {
  const statItems = [
    { label: '攀登记录', value: user.stats.climbs, icon: 'landscape' },
    { label: '关注者', value: user.stats.followers, icon: 'group' },
    { label: '正在关注', value: user.stats.following, icon: 'person_add' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-20 reveal-on-scroll">
      <div className="grid grid-cols-3 gap-12 px-6">
        {statItems.map((item, idx) => (
          <div key={idx} className="glass-premium rounded-[2.5rem] p-10 flex flex-col items-center group hover:-translate-y-2 transition-all duration-700">
            <span className="text-5xl font-black text-white font-display italic group-hover:text-accent transition-colors">
              {item.value}
            </span>
            <div className="flex items-center gap-3 mt-4">
              <span className="material-symbols-outlined text-sm text-zinc-600 group-hover:text-accent transition-colors">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {item.label}
              </span>
            </div>
            {/* 底部点缀线 */}
            <div className="mt-8 w-1/4 h-0.5 bg-white/5 group-hover:w-full group-hover:bg-accent transition-all duration-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;