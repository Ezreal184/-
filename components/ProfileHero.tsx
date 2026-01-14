
import React, { useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { generateProfileSummary } from '../services/geminiService';

interface ProfileHeroProps {
  onEdit: () => void;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ onEdit }) => {
  const [tagline, setTagline] = useState(MOCK_USER.bio);
  const [loading, setLoading] = useState(false);

  const handleRefreshBio = async () => {
    setLoading(true);
    const newBio = await generateProfileSummary(MOCK_USER.stats);
    setTagline(newBio);
    setLoading(false);
  };

  return (
    <section className="relative w-full">
      {/* 封面图 */}
      <div className="relative w-full h-[35vh] lg:h-[45vh] overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center bg-fixed" 
          style={{ backgroundImage: `url(${MOCK_USER.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      {/* 身份信息 */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 -mt-24 relative z-10 flex flex-col items-center">
        <div 
          className="size-40 lg:size-48 rounded-full border-[6px] border-white shadow-2xl bg-cover bg-center bg-white" 
          style={{ backgroundImage: `url(${MOCK_USER.avatarUrl})` }}
        />
        
        <div className="mt-6 text-center max-w-2xl">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight font-display">{MOCK_USER.name}</h1>
            <span className="material-symbols-outlined text-primary text-2xl fill-[1]">verified</span>
          </div>
          
          <p className="mt-3 text-zinc-500 text-lg leading-relaxed font-medium">
            {tagline}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              编辑资料
            </button>
            <button 
              onClick={handleRefreshBio}
              disabled={loading}
              className="flex items-center justify-center size-12 border-2 border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all active:scale-90"
              title="使用 AI 润色"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
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
