
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthViewProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const CLIMBER_IMAGES = [
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1516592673814-189c0513fd5c?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&q=80&w=2000"
];

const MOUNTAIN_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&q=80&w=2000"
];

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onBack }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentClimber, setCurrentClimber] = useState(CLIMBER_IMAGES[0]);
  const [currentMountain, setCurrentMountain] = useState(MOUNTAIN_IMAGES[0]);
  
  // 表单状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // 每次切换登录/注册状态时，随机选择一张新图片
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * (isLogin ? CLIMBER_IMAGES.length : MOUNTAIN_IMAGES.length));
    if (isLogin) {
      setCurrentClimber(CLIMBER_IMAGES[randomIndex]);
    } else {
      setCurrentMountain(MOUNTAIN_IMAGES[randomIndex]);
    }
    setError(null);
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) {
          setError(error.message || '登录失败，请检查邮箱和密码');
          setLoading(false);
          return;
        }
      } else {
        const { error } = await signUp({ email, password, fullName });
        if (error) {
          setError(error.message || '注册失败，请稍后重试');
          setLoading(false);
          return;
        }
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || '操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 z-[200] flex bg-black overflow-hidden font-sans antialiased">
      
      {/* 动态背景容器：始终存在，桌面端居左，移动端全屏 */}
      <div className="absolute inset-0 lg:relative lg:w-1/2 overflow-hidden transition-all duration-700 z-0">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Climber Background" 
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
            src={currentClimber}
          />
          <img 
            alt="Mountain Background" 
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${!isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
            src={currentMountain}
          />
        </div>
        
        {/* 蒙层：为了在看到图片的同时保护文字可读性，移动端采用更微妙的深色渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 lg:bg-black/30 z-10"></div>
        
        {/* 品牌文字：桌面端特有布局 */}
        <div className="hidden lg:flex relative z-20 p-20 flex-col justify-between h-full w-full text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">terrain</span>
            <span className="text-2xl font-display italic font-bold tracking-tight">SUMMIT REACH</span>
          </div>
          
          <div className="max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-5xl font-display italic leading-tight mb-4">
              {isLogin ? "Join the Ascent." : "Reach the Peak."}
            </h2>
            <div className="w-12 h-0.5 bg-white/60 mb-4"></div>
            <p className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-70">Elevate Your Journey</p>
          </div>
        </div>
      </div>

      {/* 表单面板容器 */}
      {/* 移动端：完全透明背景，内容包裹在悬浮卡片中 */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-4 md:p-16 lg:p-24 bg-transparent lg:bg-white lg:dark:bg-zinc-950">
        
        <button 
          onClick={onBack}
          className="absolute top-8 right-8 lg:top-12 lg:right-12 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold 
                     text-white/60 lg:text-slate-400 hover:text-white lg:hover:text-black transition-colors z-30"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          EXIT
        </button>

        {/* 移动端悬浮玻璃卡片 / 桌面端无色容器 */}
        <div className="w-full max-w-sm p-8 lg:p-0 rounded-[2rem] bg-black/10 backdrop-blur-[2px] border border-white/10 lg:bg-transparent lg:backdrop-blur-none lg:border-none shadow-2xl lg:shadow-none animate-in fade-in zoom-in-95 duration-500">
          
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <span className="material-symbols-outlined text-white text-3xl">terrain</span>
            <span className="text-white text-xl font-display italic font-bold uppercase tracking-tight">SUMMIT REACH</span>
          </div>

          <div className="mb-8 lg:mb-14 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-3 text-white lg:text-zinc-900 lg:dark:text-white">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-white/60 lg:text-zinc-500 lg:dark:text-zinc-400 text-sm">
              {isLogin ? 'Sign in to access your dashboard.' : 'Create an account to join our community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="relative group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 lg:text-zinc-500 lg:dark:text-zinc-400 mb-2">Full Name</label>
                <input 
                  className="summit-input w-full py-3 focus:ring-0 text-lg transition-all outline-none text-white lg:text-zinc-900 lg:dark:text-white border-white/30 lg:border-zinc-200" 
                  placeholder="Explorer Name" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="relative group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 lg:text-zinc-500 lg:dark:text-zinc-400 mb-2">Email Address</label>
              <input 
                className="summit-input w-full py-3 focus:ring-0 text-lg transition-all outline-none text-white lg:text-zinc-900 lg:dark:text-white border-white/30 lg:border-zinc-200" 
                placeholder="name@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <div className="flex justify-between items-end">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 lg:text-zinc-500 lg:dark:text-zinc-400 mb-2">Password</label>
                {isLogin && <a className="text-[10px] font-bold uppercase tracking-widest text-white/40 lg:text-slate-400 hover:text-white lg:hover:text-black mb-2 transition-colors" href="#">Forgot?</a>}
              </div>
              <input 
                className="summit-input w-full py-3 focus:ring-0 text-lg transition-all outline-none text-white lg:text-zinc-900 lg:dark:text-white border-white/30 lg:border-zinc-200" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <button 
                disabled={loading}
                className="w-full bg-white lg:bg-black text-black lg:text-white py-4 lg:py-5 px-6 font-bold tracking-[0.2em] uppercase text-xs hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-3 group shadow-2xl" 
                type="submit"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 lg:mt-14 pt-6 lg:pt-10 border-t border-white/10 lg:border-zinc-200/50 lg:dark:border-zinc-800">
            <p className="text-sm text-white/50 lg:text-zinc-500 lg:dark:text-zinc-400 text-center">
              {isLogin ? "Don't have an account?" : "Already an explorer?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white lg:text-zinc-900 lg:dark:text-white font-bold hover:underline underline-offset-8 ml-2 decoration-2"
              >
                {isLogin ? 'Create' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthView;
