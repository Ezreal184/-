import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  replies?: Comment[];
}

interface PostDetailViewProps {
  post: any;
  onBack: () => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onBack, isLoggedIn, onAuthRequired }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 101,
      user: "探险向导_Z",
      avatar: "https://picsum.photos/100/100?random=50",
      text: "这一段路线的岩石风化很严重，建议在凌晨 4 点前通过。注意落石！",
      time: "2小时前",
      likes: 12,
      replies: [
        { id: 201, user: "新手小王", avatar: "https://picsum.photos/100/100?random=51", text: "收到！我们会带上额外的保护装备。", time: "1小时前", likes: 3 }
      ]
    },
    {
      id: 102,
      user: "雪山摄影师",
      avatar: "https://picsum.photos/100/100?random=52",
      text: "这张照片的构图绝了，光线正好打在山脊上。是用什么滤镜吗？",
      time: "45分钟前",
      likes: 8
    }
  ]);


  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return onAuthRequired();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: "你",
      avatar: post.currentUserAvatar || "https://picsum.photos/100/100?random=99",
      text: commentText,
      time: "刚刚",
      likes: 0
    };

    if (replyTo) {
      setComments(prev => prev.map(c => 
        c.id === replyTo ? { ...c, replies: [...(c.replies || []), newComment] } : c
      ));
      setReplyTo(null);
    } else {
      setComments([newComment, ...comments]);
    }
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-950 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-right duration-700">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-20 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-zinc-950/80 to-transparent backdrop-blur-sm">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-white hover:text-cyan-400 transition-colors"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">返回大本营</span>
        </button>
        <div className="flex gap-4">
          <button className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
          <button className="size-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 左侧内容区 */}
        <div className="lg:col-span-8 space-y-12">
          <div className="relative group overflow-hidden rounded-[3rem]">
            <img 
              src={post.image} 
              alt="Post Image" 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-[2s]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-10 left-10">
              <span className="px-4 py-1.5 bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">高峰日志</span>
              <h1 className="text-4xl lg:text-7xl font-black font-display italic text-white uppercase leading-tight tracking-tighter">
                {post.location?.split(',')[0] || '探险'} <br/> 冲顶实录
              </h1>
            </div>
          </div>

          <div className="prose prose-invert prose-xl max-w-none">
            <p className="text-zinc-300 leading-relaxed font-medium">
              在极高海拔的空气中，每一次呼吸都像是对生命的重新定义。凌晨 2:15，我们从 4 号营地出发，气温大约在零下 28 度。
              正如之前预料的，西脊的雪况非常松散，我们不得不频繁更换领攀者以维持体能。
            </p>
            <p className="text-zinc-400 leading-relaxed">
              当我们到达所谓的"希拉里台阶"时，太阳刚刚从地平线升起。那一刻，所有的寒冷和疲惫都被金色的光芒瞬间消融。
              这不仅是一次体能的逾越，更是一次精神的洗礼。#登山精神 #向死而生
            </p>
          </div>

          {/* 交互栏 */}
          <div className="flex items-center gap-10 py-10 border-t border-white/10">
            <button className="flex items-center gap-3 text-white group">
              <span className="material-symbols-outlined text-3xl group-hover:scale-125 group-hover:text-red-500 transition-all">favorite</span>
              <span className="font-black text-xl">{post.likes}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-3 text-white group"
            >
              <span className="material-symbols-outlined text-3xl group-hover:scale-125 group-hover:text-cyan-400 transition-all">chat_bubble</span>
              <span className="font-black text-xl">{comments.length}</span>
            </button>
          </div>

          {/* 评论区 - 动态滑入 */}
          {showComments && (
            <div className="space-y-10 animate-in slide-in-from-top-2 duration-500">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                <form onSubmit={handlePostComment} className="flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">
                    {replyTo ? `正在回复评论 #${replyTo}` : '发表探险评论'}
                  </h3>
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={replyTo ? "写下你的回复..." : "分享你的看法或询问技术细节..."}
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-600 text-lg resize-none h-24"
                  />
                  <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <div className="flex gap-2">
                      <button type="button" className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">alternate_email</span>
                      </button>
                      <button type="button" className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                      </button>
                    </div>
                    <div className="flex gap-4">
                      {replyTo && (
                        <button 
                          type="button"
                          onClick={() => { setReplyTo(null); setCommentText(''); }}
                          className="px-6 py-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest"
                        >
                          取消
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="px-10 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors"
                      >
                        提交发送
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* 评论列表 */}
              <div className="space-y-8 relative pl-6 lg:pl-10">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-6">
                    <div className="flex gap-6 group">
                      <div className="relative">
                        <div className="size-12 rounded-2xl overflow-hidden border border-white/20">
                          <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute top-1/2 -left-[24px] lg:-left-[40px] w-[24px] lg:w-[40px] h-px bg-white/10"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{comment.user}</h4>
                          <span className="text-[10px] font-bold text-zinc-500">{comment.time}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed mb-4">{comment.text}</p>
                        <div className="flex gap-6">
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-sm">favorite</span> {comment.likes}
                          </button>
                          <button 
                            onClick={() => { setReplyTo(comment.id); setCommentText(''); }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">reply</span> 回复
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 二级回复 */}
                    {comment.replies?.map((reply) => (
                      <div key={reply.id} className="ml-12 lg:ml-20 flex gap-6 group border-l border-white/5 pl-8 py-2 relative">
                        <div className="absolute top-1/2 left-0 w-4 h-px bg-white/5"></div>
                        <div className="size-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img src={reply.avatar} alt={reply.user} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xs font-black text-white uppercase tracking-tight">{reply.user}</h4>
                            <span className="text-[9px] font-bold text-zinc-500">{reply.time}</span>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* 右侧边栏：环境参数 */}
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-400 mb-10 border-l-4 border-cyan-400 pl-4">攀登环境模拟</h3>
              <div className="space-y-8">
                {[
                  { label: '海拔高度', value: '7,420 M', icon: 'landscape', color: 'text-white' },
                  { label: '氧气浓度', value: '42%', icon: 'air', color: 'text-orange-400' },
                  { label: '外部气温', value: '-24°C', icon: 'thermostat', color: 'text-blue-400' },
                  { label: '当前体感', value: '极度严酷', icon: 'ac_unit', color: 'text-zinc-500' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                    </div>
                    <span className={`text-lg font-black font-display italic ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">探险者健康状态</span>
                  <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">稳定</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%] animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-cyan-400 text-black rounded-[3rem] shadow-2xl shadow-cyan-400/20">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-2xl font-black">shield</span>
                <h3 className="text-sm font-black uppercase tracking-widest">安全顾问建议</h3>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-80 mb-6">
                该区域未来 6 小时内预计会有强上升气流，建议减少在山脊停留时间，尽快进入 C4 营地避风。
              </p>
              <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">查看完整路线风险报告</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailView;
