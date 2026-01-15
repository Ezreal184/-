import React, { useState, useEffect } from 'react';
import { MOCK_POSTS } from '../constants';
import { getClimbAdvice } from '../services/geminiService';
import { getUserPosts } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import type { PostWithAuthor } from '../types/database';

interface PostGridProps {
  onNavigate?: (view: any, payload?: any) => void;
  onAuthRequired?: () => void;
  isLoggedIn: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  // 加载用户帖子
  useEffect(() => {
    loadUserPosts();
  }, [user]);

  const loadUserPosts = async () => {
    if (!user) {
      // 如果没有用户，使用模拟数据
      const enhancedPosts = MOCK_POSTS.map((post, idx) => ({
        ...post,
        grade: ['V4', 'V7', 'V3', 'V9', 'V2', 'V5'][idx] || 'V-Expert',
        altitude: ['5364M', '3842M', '4120M', '8848M', '4392M', '1200M'][idx] || '0M',
        oxygen: ['82%', '94%', '88%', '34%', '91%', '98%'][idx] || '100%',
        isWide: idx % 4 === 0,
      }));
      setPosts(enhancedPosts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserPosts(user.id, 1, 20);
      
      // 转换数据格式并添加UI增强数据
      const enhancedPosts = response.data.map((post, idx) => ({
        ...post,
        imageUrl: post.image_url || MOCK_POSTS[idx % MOCK_POSTS.length].imageUrl,
        grade: ['V4', 'V7', 'V3', 'V9', 'V2', 'V5'][idx % 6] || 'V-Expert',
        altitude: ['5364M', '3842M', '4120M', '8848M', '4392M', '1200M'][idx % 6] || '0M',
        oxygen: ['82%', '94%', '88%', '34%', '91%', '98%'][idx % 6] || '100%',
        isWide: idx % 4 === 0,
      }));
      
      setPosts(enhancedPosts);
    } catch (error) {
      console.error('加载用户帖子失败:', error);
      // 出错时使用模拟数据
      const enhancedPosts = MOCK_POSTS.map((post, idx) => ({
        ...post,
        grade: ['V4', 'V7', 'V3', 'V9', 'V2', 'V5'][idx] || 'V-Expert',
        altitude: ['5364M', '3842M', '4120M', '8848M', '4392M', '1200M'][idx] || '0M',
        oxygen: ['82%', '94%', '88%', '34%', '91%', '98%'][idx] || '100%',
        isWide: idx % 4 === 0,
      }));
      setPosts(enhancedPosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (e: React.MouseEvent, post: any) => {
    // 如果点击的是导航按钮则不触发扫描
    if ((e.target as HTMLElement).closest('.nav-action')) return;

    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }

    if (activeScan === post.id) {
      setActiveScan(null);
      return;
    }

    setActiveScan(post.id);
    setScanLoading(true);
    try {
      const aiAdvice = await getClimbAdvice(post.title);
      setAdvice(aiAdvice);
    } catch (error) {
      console.error('获取攀登建议失败:', error);
      setAdvice('暂时无法获取攀登建议，请稍后重试。');
    } finally {
      setScanLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-zinc-400">加载帖子中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-32 py-20">
      {/* 栏目介绍 */}
      <div className="reveal-on-scroll max-w-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-accent mb-6">Field Dispatch</h3>
        <p className="text-3xl font-medium text-zinc-400 leading-tight italic">
          捕捉巅峰瞬间的原始回响。每一份日志都是一次对极限的实地勘测。
        </p>
      </div>

      {/* 交错网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-zinc-400 text-lg">暂无帖子数据</p>
          </div>
        ) : (
          posts.map((post, idx) => (
            <div 
              key={post.id}
              onClick={(e) => handlePostClick(e, post)}
              className={`reveal-on-scroll group relative cursor-pointer flex flex-col ${post.isWide ? 'md:col-span-2' : ''}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              {/* 核心卡片容器 */}
              <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden rounded-[3.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] group-hover:shadow-accent/10 transition-all duration-700">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[4s] group-hover:scale-110" 
                />
                
                {/* 顶部环境数据层 */}
                <div className="absolute top-10 left-10 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                  <div className="px-5 py-2 glass-premium rounded-full">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">Grade {post.grade}</span>
                  </div>
                  <div className="px-5 py-2 glass-premium rounded-full">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">{post.altitude}</span>
                  </div>
                </div>

                {/* 底部渐变遮罩与文字 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-12">
                  <div className="space-y-4">
                    <h3 className="text-white font-black text-4xl lg:text-5xl font-display italic uppercase tracking-tighter leading-none group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-6">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">{post.location} • {post.date}</p>
                      <div className="h-px flex-1 bg-white/10" />
                      <button 
                        onClick={() => onNavigate?.('post-detail', post)}
                        className="nav-action size-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                      >
                        <span className="material-symbols-outlined text-sm">north_east</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI 扫描层叠加 */}
                {activeScan === post.id && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md p-12 flex flex-col animate-in fade-in duration-500">
                    <div className="flex justify-between items-start mb-12">
                      <div className="space-y-2">
                         <p className="text-accent text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
                           <span className="size-2 bg-accent rounded-full animate-ping" />
                           Satellite Scan Active
                         </p>
                         <p className="text-zinc-500 text-[8px] font-bold uppercase">Node ID: SR-OS-9921</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveScan(null); }}
                        className="size-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>

                    <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
                      {scanLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-24 h-px bg-accent/20 relative overflow-hidden mb-6">
                             <div className="absolute inset-0 bg-accent translate-x-[-100%] animate-[slide_1.5s_infinite]" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">Retrieving Topo Data</p>
                        </div>
                      ) : (
                        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">O2 Concentration</span>
                              <p className="text-2xl font-black font-display italic text-accent">{post.oxygen}</p>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Success Rate</span>
                              <p className="text-2xl font-black font-display italic text-white">68.2%</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                              <span className="material-symbols-outlined text-xs">auto_awesome</span>
                              Tactical Advice
                            </span>
                            <p className="text-xl text-zinc-200 leading-relaxed font-light italic">
                              {advice}
                            </p>
                          </div>
                          <button className="w-full py-4 bg-accent text-black text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                            Download Route Map
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 扫描线动画 */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/30 blur-sm animate-[scan_3s_linear_infinite]" />
                  </div>
                )}
              </div>

              {/* 卡片下方的极简描述（仅非宽屏展示） */}
              {!post.isWide && (
                <div className="mt-8 px-6 group-hover:translate-x-4 transition-transform duration-700">
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 italic">
                    每一次登顶都是对自我的重新定义，在高海拔的稀薄空气中寻找存在的最纯粹形式。
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 加载更多交互 */}
      <div className="reveal-on-scroll flex justify-center pt-20">
        <button className="magnetic-btn group relative px-16 py-6 glass-premium rounded-full text-[10px] font-black uppercase tracking-[1em] hover:bg-white hover:text-black transition-all">
          <span className="relative z-10">Load More Archives</span>
          <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PostGrid;