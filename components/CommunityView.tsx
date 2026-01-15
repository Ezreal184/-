import React, { useState, useEffect } from 'react';
import { getTrendingInsights } from '../services/geminiService';

interface CommunityViewProps {
  onNavigate: (view: any, payload?: any) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

const PEAK_WEATHER = [
  { name: "Mount Everest", alt: "8848m", temp: "-32°C", wind: "45km/h", status: "Warning" },
  { name: "K2", alt: "8611m", temp: "-38°C", wind: "20km/h", status: "Optimal" },
  { name: "Mont Blanc", alt: "4810m", temp: "-12°C", wind: "10km/h", status: "Clear" },
];

const INITIAL_POSTS = [
  {
    id: 1,
    user: "Elena Rossi",
    avatar: "https://picsum.photos/100/100?random=10",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
    content: "本季最后的登顶！艾格峰北壁极具挑战性，但回报丰厚。#艾格峰 #登山",
    likes: 432,
    hasLiked: false,
    location: "艾格峰, 瑞士",
    title: "专家探险家",
    bio: "专注于阿尔卑斯式攀登和极寒摄影。"
  },
  {
    id: 2,
    user: "Kenji Tanaka",
    avatar: "https://picsum.photos/100/100?random=12",
    image: "https://images.unsplash.com/photo-1516592673814-189c0513fd5c?auto=format&fit=crop&q=80&w=1200",
    content: "今天的富士山日出。空气清新，能见度近乎完美。",
    likes: 891,
    hasLiked: false,
    location: "富士山, 日本",
    title: "峰值摄影师",
    bio: "捕捉高山最纯净的瞬间。"
  }
];

const INITIAL_EXPLORERS = [
  { id: 1, name: "登山者_X42", stats: "8千米级登顶 • 1.2万 关注者", followed: false, avatar: "https://picsum.photos/100/100?random=21", title: "远征队长", bio: "喜马拉雅山脉专家。" },
  { id: 2, name: "寻峰者", stats: "14座高峰 • 8千 关注者", followed: false, avatar: "https://picsum.photos/100/100?random=22", title: "自由攀登者", bio: "极致轻量化登山推崇者。" },
  { id: 3, name: "顶峰女王", stats: "7大洲最高峰 • 3.5万 关注者", followed: false, avatar: "https://picsum.photos/100/100?random=23", title: "极地探险家", bio: "追求地球极限的脚步从未停止。" },
];

const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [explorers, setExplorers] = useState(INITIAL_EXPLORERS);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [snowParticles, setSnowParticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getTrendingInsights();
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();

    const particles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: `${2 + Math.random() * 4}px`,
      opacity: 0.1 + Math.random() * 0.4
    }));
    setSnowParticles(particles);
  }, []);

  const handleLike = (id: number) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes + 1, hasLiked: !post.hasLiked } : post
    ));
  };

  const handleFollow = (id: number) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    setExplorers(explorers.map(exp => 
      exp.id === id ? { ...exp, followed: !exp.followed } : exp
    ));
  };

  return (
    <div className="fluid-bg min-h-screen">
      {snowParticles.map(p => (
        <div 
          key={p.id}
          className="snow-particle animate-snow"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            backgroundColor: 'rgba(255,255,255,0.8)'
          }}
        />
      ))}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-16 flex flex-col lg:flex-row gap-16 relative z-10">
        
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <h2 className="text-4xl font-black font-display italic uppercase tracking-tighter dark:text-white">Expedition Feed</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-black uppercase tracking-widest">最新</button>
              <button className="px-4 py-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">热门</button>
            </div>
          </div>

          {posts.map(post => (
            <div key={post.id} className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/30 dark:border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.01]">
              <div className="p-8 flex items-center justify-between">
                <div 
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => onNavigate('other-profile', post)}
                >
                  <div className="size-14 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-105 transition-transform">
                    <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">{post.user}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{post.location}</p>
                  </div>
                </div>
                <button className="size-10 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
              </div>
              
              <div className="aspect-[16/10] overflow-hidden cursor-zoom-in">
                <img src={post.image} alt="Expedition" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-all ${post.hasLiked ? 'text-red-500 scale-110' : 'text-zinc-600 dark:text-zinc-400 hover:text-red-500'}`}
                  >
                    <span className={`material-symbols-outlined ${post.hasLiked ? 'fill-[1]' : ''}`}>favorite</span>
                    <span className="text-sm font-black">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="text-sm font-black">24</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary ml-auto transition-colors">
                    <span className="material-symbols-outlined">ios_share</span>
                  </button>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium text-lg">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96 space-y-10">
          {/* 全球巅峰气象站 */}
          <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-zinc-800 p-8 rounded-[2rem] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 border-l-4 border-cyan-400 pl-4">巅峰气象站</h3>
              <span className="text-[8px] font-bold text-cyan-400 animate-pulse uppercase tracking-widest">Live</span>
            </div>
            <div className="space-y-6">
              {PEAK_WEATHER.map((peak, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-cyan-400/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">{peak.name}</h4>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{peak.alt}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      peak.status === 'Optimal' ? 'bg-green-500/10 text-green-500' :
                      peak.status === 'Warning' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {peak.status}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-zinc-400">thermostat</span>
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{peak.temp}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-zinc-400">air</span>
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{peak.wind}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary dark:bg-white rounded-[2rem] p-8 text-white dark:text-black shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
               <span className="material-symbols-outlined text-6xl">insights</span>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Alpine Intelligence</span>
            </div>
            <h3 className="text-2xl font-black font-display mb-6 italic uppercase">全球攀登趋势</h3>
            {loadingInsights ? (
              <div className="space-y-3">
                <div className="h-3 bg-white/20 dark:bg-black/10 rounded-full w-full"></div>
                <div className="h-3 bg-white/20 dark:bg-black/10 rounded-full w-4/5"></div>
              </div>
            ) : (
              <p className="text-sm font-medium leading-relaxed opacity-80 whitespace-pre-wrap">
                {insights}
              </p>
            )}
            <button className="mt-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/btn">
              阅读完整深度报告 
              <span className="material-symbols-outlined text-xs group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xl border border-white/40 dark:border-zinc-800 p-8 rounded-[2rem]">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-8 border-l-4 border-primary dark:border-white pl-4">巅峰探索者</h3>
            <div className="space-y-6">
              {explorers.map(exp => (
                <div key={exp.id} className="flex items-center justify-between group">
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => onNavigate('other-profile', exp)}
                  >
                    <div className="size-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                      <img src={exp.avatar} alt={exp.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{exp.name}</h4>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5">{exp.stats}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollow(exp.id)}
                    className={`size-8 rounded-lg flex items-center justify-center transition-all ${exp.followed ? 'bg-zinc-100 text-zinc-400' : 'bg-primary dark:bg-white text-white dark:text-black hover:scale-110'}`}
                  >
                    <span className="material-symbols-outlined text-sm">{exp.followed ? 'check' : 'person_add'}</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-primary dark:hover:text-white transition-all rounded-xl">探索更多领域专家</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
