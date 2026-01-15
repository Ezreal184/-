import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFeedPosts, likePost, unlikePost, getLikeStatuses } from '../services/postService';
import { followUser, unfollowUser, isFollowing } from '../services/followService';
import { getTrendingInsights } from '../services/geminiService';
import type { PostWithAuthor } from '../types/database';

interface CommunityViewProps {
  onNavigate: (view: any, payload?: any) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

const PEAK_WEATHER = [
  { name: "Everest", alt: "8848m", temp: "-32°C", wind: "45km/h", status: "Warning" },
  { name: "K2", alt: "8611m", temp: "-38°C", wind: "20km/h", status: "Optimal" },
  { name: "Mont Blanc", alt: "4810m", temp: "-12°C", wind: "10km/h", status: "Clear" },
];

const CommunityView: React.FC<CommunityViewProps> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [sortMode, setSortMode] = useState<'latest' | 'trending'>('latest');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [insights, setInsights] = useState<string | null>(null);

  // 加载帖子数据
  useEffect(() => {
    loadPosts();
  }, []);

  // 加载点赞状态
  useEffect(() => {
    if (user && posts.length > 0) {
      loadLikeStatuses();
    }
  }, [user, posts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getFeedPosts(1, 20);
      
      // 转换数据格式以匹配UI需求
      const formattedPosts = response.data.map(post => ({
        ...post,
        user: post.profiles.name,
        avatar: post.profiles.avatar_url || "https://picsum.photos/100/100?random=10",
        image: post.image_url || "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
        content: post.content || post.title,
        likes: post.likes_count,
        location: post.location || "未知位置",
        title: post.profiles.title || "探险家",
        bio: "专注于高山探险"
      }));
      
      setPosts(formattedPosts);
      
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikeStatuses = async () => {
    if (!user || posts.length === 0) return;
    
    try {
      const postIds = posts.map(p => p.id);
      const likeStatuses = await getLikeStatuses(postIds);
      
      // 将 Record<string, boolean> 转换为 Set<string>
      const likedPostIds = new Set(
        Object.entries(likeStatuses)
          .filter(([_, isLiked]) => isLiked)
          .map(([postId, _]) => postId)
      );
      setLikedPosts(likedPostIds);
      
      // 更新帖子的点赞状态
      setPosts(prev => prev.map(post => ({
        ...post,
        hasLiked: likeStatuses[post.id] || false
      })));
    } catch (error) {
      console.error('加载点赞状态失败:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn || !user) {
      onAuthRequired();
      return;
    }

    try {
      const isCurrentlyLiked = likedPosts.has(postId);
      
      if (isCurrentlyLiked) {
        await unlikePost(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await likePost(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
      }

      // 更新本地状态
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
              hasLiked: !isCurrentlyLiked 
            } 
          : post
      ));
    } catch (error) {
      console.error('点赞操作失败:', error);
    }
  };

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => sortMode === 'trending' ? b.likes - a.likes : new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [posts, sortMode]);

  if (loading) {
    return (
      <div className="relative py-40 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-zinc-400">加载社区动态中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-40 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 space-y-48">
      
      {/* 头部：大面积呼吸感排版 */}
      <div className="flex flex-col lg:flex-row items-end justify-between reveal-on-scroll">
        <div className="max-w-3xl">
          <p className="text-accent text-[10px] font-black uppercase tracking-[0.8em] mb-10">Live Expedition Chronicle</p>
          <h2 className="text-[12vw] lg:text-[10rem] font-black font-display italic uppercase tracking-tighter leading-[0.8]">
            THE <br/> <span className="text-white/20">VOICE</span>
          </h2>
        </div>
        <div className="mt-20 lg:mt-0 flex flex-col items-end gap-8">
          <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-2xl rounded-2xl">
            <button 
              onClick={() => setSortMode('latest')}
              className={`px-10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'latest' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Latest
            </button>
            <button 
              onClick={() => setSortMode('trending')}
              className={`px-10 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${sortMode === 'trending' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Trending
            </button>
          </div>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic text-right">
            Synchronized with <br/> global satellite nodes
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-40">
        {/* 帖子卡片：无边框设计，靠阴影和间距区分 */}
        <div className="flex-1 space-y-60">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">暂无社区动态</p>
            </div>
          ) : (
            sortedPosts.map((post, idx) => (
              <div 
                key={post.id} 
                onClick={() => onNavigate('post-detail', post)}
                className="reveal-on-scroll group cursor-pointer"
              >
                <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                  <img 
                    src={post.image} 
                    alt="Expedition" 
                    className="w-full h-full object-cover transition-transform duration-[5s] ease-out group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute top-10 right-10 flex gap-4">
                    <div className="px-5 py-2 glass-premium rounded-full text-[8px] font-black uppercase tracking-widest">Alpine High</div>
                  </div>

                  <div className="absolute bottom-12 left-12 flex items-center gap-8">
                    <div className="size-20 rounded-3xl overflow-hidden border border-white/20 shadow-2xl group-hover:rotate-6 transition-transform">
                      <img src={post.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white">{post.user}</h4>
                      <p className="text-[11px] font-bold text-accent uppercase tracking-[0.4em]">{post.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-4xl px-4">
                  <h3 className="text-4xl lg:text-5xl font-medium text-zinc-300 leading-[1.2] mb-12 group-hover:text-white transition-all duration-700">
                    {post.content}
                  </h3>
                  <div className="flex items-center gap-12">
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-3 transition-colors ${post.hasLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                      >
                        <span className="material-symbols-outlined text-lg">favorite</span> {post.likes}
                      </button>
                      <span className="flex items-center gap-3 hover:text-accent transition-colors">
                        <span className="material-symbols-outlined text-lg">chat_bubble</span> {post.comments_count || 0}
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[9px] font-black uppercase tracking-[0.8em] text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all">Explore Record</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 侧边栏：模块化玻璃拟态，无分割线 */}
        <div className="w-full lg:w-[450px] space-y-40">
          <div className="reveal-on-scroll glass-premium p-12 rounded-[3rem]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-zinc-500 mb-16">Global Observatory</h3>
            <div className="space-y-16">
              {PEAK_WEATHER.map((peak, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h4 className="text-2xl font-black uppercase italic group-hover:text-accent transition-all group-hover:translate-x-2">{peak.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{peak.alt}</p>
                    </div>
                    <span className="text-4xl font-black font-display italic text-white/40 group-hover:text-white transition-colors">{peak.temp}</span>
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="flex items-center gap-3"><span className="material-symbols-outlined text-sm text-accent">air</span> {peak.wind}</span>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className={peak.status === 'Optimal' ? 'text-cyan-400' : 'text-amber-500'}>{peak.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-on-scroll relative group">
            <div className="absolute inset-0 bg-accent blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative bg-white p-16 rounded-[3rem] text-black overflow-hidden shadow-2xl">
              <h3 className="text-4xl font-black font-display italic uppercase mb-6 leading-[0.9]">Summit <br/> Privilege</h3>
              <p className="text-[11px] font-bold opacity-40 uppercase mb-12 tracking-widest">Global Elite Access</p>
              <button className="magnetic-btn w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">Apply Certification</button>
              
              <div className="absolute -bottom-16 -right-16 opacity-[0.05] group-hover:scale-125 transition-transform duration-[4s]">
                 <span className="material-symbols-outlined text-[20rem]">verified</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityView;