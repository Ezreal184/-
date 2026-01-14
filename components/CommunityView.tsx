
import React, { useState, useEffect } from 'react';
import { getTrendingInsights } from '../services/geminiService';

interface CommunityViewProps {
  onNavigate: (view: any, payload?: any) => void;
  isLoggedIn: boolean;
}

const INITIAL_POSTS = [
  {
    id: 1,
    user: "Elena Rossi",
    avatar: "https://picsum.photos/100/100?random=10",
    image: "https://picsum.photos/800/600?random=11",
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
    image: "https://picsum.photos/800/600?random=13",
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
  { id: 3, name: "顶峰女王", stats: "专家向导 • 1.5万 关注者", followed: false, avatar: "https://picsum.photos/100/100?random=23", title: "IFMGA 向导", bio: "多年勃朗峰带队经验。" },
];

const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate, isLoggedIn }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [explorers, setExplorers] = useState(INITIAL_EXPLORERS);
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(true);
  
  // 评论相关状态
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getTrendingInsights();
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const handleLike = (id: number) => {
    if (!isLoggedIn) {
      onNavigate('auth');
      return;
    }
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  const handleCommentToggle = (id: number) => {
    if (!isLoggedIn) {
      onNavigate('auth');
      return;
    }
    if (activeCommentId === id) {
      setActiveCommentId(null);
      setCommentText('');
    } else {
      setActiveCommentId(id);
    }
  };

  const handleSendComment = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentText('');
    setActiveCommentId(null);
    alert('评论已发送！');
  };

  const handleFollow = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onNavigate('auth');
      return;
    }
    setExplorers(prev => prev.map(exp => {
      if (exp.id === id) return { ...exp, followed: !exp.followed };
      return exp;
    }));
  };

  const navigateToUser = (user: any) => {
    onNavigate('other-profile', user);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-12 flex flex-col lg:flex-row gap-12">
      <div className="flex-1 space-y-10">
        <h2 className="text-3xl font-black font-display mb-8">全球动态</h2>
        
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-zinc-950 rounded-none border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden group">
            <div className="p-6 flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer group/user"
                onClick={() => navigateToUser({ name: post.user, avatar: post.avatar, title: post.title, bio: post.bio })}
              >
                <div 
                  className="size-10 rounded-full bg-cover transition-transform group-hover/user:scale-105" 
                  style={{ backgroundImage: `url(${post.avatar})` }}
                />
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-none group-hover/user:text-primary dark:group-hover/user:text-white transition-colors">{post.user}</h4>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {post.location}
                  </p>
                </div>
              </div>
              <button className="text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            
            <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
            
            <div className="p-6 pb-4">
              <div className="flex items-center gap-6 mb-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 transition-colors ${post.hasLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}
                >
                  <span className={`material-symbols-outlined ${post.hasLiked ? 'fill-[1]' : ''}`}>favorite</span>
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button 
                  onClick={() => handleCommentToggle(post.id)}
                  className={`flex items-center gap-1 transition-colors ${activeCommentId === post.id ? 'text-primary dark:text-white' : 'text-zinc-500 hover:text-primary dark:hover:text-white'}`}
                >
                  <span className="material-symbols-outlined">chat_bubble</span>
                  <span className="text-xs font-bold">24</span>
                </button>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                <span 
                  className="font-bold mr-2 text-zinc-900 dark:text-white cursor-pointer hover:underline underline-offset-4"
                  onClick={() => navigateToUser({ name: post.user, avatar: post.avatar, title: post.title, bio: post.bio })}
                >
                  {post.user}
                </span>
                {post.content}
              </p>
            </div>

            {activeCommentId === post.id && (
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-300">
                <form onSubmit={(e) => handleSendComment(e, post.id)} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      autoFocus
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="分享你的见解..."
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-none px-4 py-2 text-sm focus:ring-1 focus:ring-primary dark:focus:ring-white transition-all outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`flex items-center justify-center size-9 transition-all ${commentText.trim() ? 'text-primary dark:text-white scale-110' : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'}`}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full lg:w-80 space-y-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-none p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-primary dark:text-white mb-4">
            <span className="material-symbols-outlined animate-pulse">auto_awesome</span>
            <h3 className="font-bold font-display uppercase tracking-widest text-[10px]">AI 社区洞察</h3>
          </div>
          {loadingInsights ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed italic">"{insights}"</p>
          )}
        </div>

        <div>
          <h3 className="font-black font-display text-xs mb-6 uppercase tracking-widest text-zinc-400">顶级探险家</h3>
          <div className="space-y-6">
            {explorers.map((exp) => (
              <div 
                key={exp.id} 
                onClick={() => navigateToUser({ name: exp.name, avatar: exp.avatar, title: exp.title, bio: exp.bio })}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800 bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: `url(${exp.avatar})` }} />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-primary dark:group-hover:text-white">{exp.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{exp.stats}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleFollow(e, exp.id)}
                  className={`px-3 py-1 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all border ${
                    exp.followed ? 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700' : 'bg-primary border-primary text-white hover:bg-opacity-90 dark:bg-white dark:text-black'
                  }`}
                >
                  {exp.followed ? 'FOLLOWING' : 'FOLLOW'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
