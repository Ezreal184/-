import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { generateProfileSummary } from '../services/geminiService';

interface ProfileHeroProps {
  user: UserProfile;
  onEdit: () => void;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ user, onEdit }) => {
  const [tagline, setTagline] = useState(user.bio);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTagline(user.bio);
  }, [user.bio]);

  const handleRefreshBio = async () => {
    setLoading(true);
    try {
      const newBio = await generateProfileSummary(user.stats);
      setTagline(newBio);
    } catch (error) {
      console.error('生成简介失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[45vh] lg:h-[55vh] overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center bg-fixed transition-transform duration-[10s] hover:scale-105" 
          style={{ backgroundImage: `url(${user.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-24 -mt-32 relative z-10 flex flex-col items-center">
        {/* 无边框头像，利用阴影建立深度 */}
        <div 
          className="size-48 lg:size-60 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-cover bg-center bg-zinc-900 group relative overflow-hidden" 
          style={{ backgroundImage: `url(${user.avatarUrl})` }}
        >
           <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="mt-12 text-center max-w-3xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter font-display text-white uppercase">{user.name}</h1>
            <span className="material-symbols-outlined text-accent text-3xl fill-[1] animate-pulse">verified</span>
          </div>
          
          <p className="text-zinc-500 text-2xl font-light italic leading-tight tracking-tight">
            {tagline}
          </p>

          <div className="mt-12 flex justify-center gap-6">
            <button 
              onClick={onEdit}
              className="px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-2xl"
            >
              Edit Archive
            </button>
            <button 
              onClick={handleRefreshBio}
              disabled={loading}
              className="size-16 flex items-center justify-center bg-white/[0.05] hover:bg-white text-zinc-400 hover:text-black rounded-3xl transition-all disabled:opacity-30 shadow-xl"
              title="Enhance with AI"
            >
              <span className={`material-symbols-outlined text-2xl ${loading ? 'animate-spin' : ''}`}>
                magic_button
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;