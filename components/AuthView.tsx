import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthViewProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const CLIMBER_IMAGES = [
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&q=80&w=2000",
];

const MOUNTAIN_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=2000",
];

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, onBack }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentClimber, setCurrentClimber] = useState(CLIMBER_IMAGES[0]);
  const [currentMountain, setCurrentMountain] = useState(MOUNTAIN_IMAGES[0]);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); 
  const [userCode, setUserCode] = useState(''); 
  const [countdown, setCountdown] = useState(0);
  const [showStatus, setShowStatus] = useState<'success' | 'error' | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * (isLogin ? CLIMBER_IMAGES.length : MOUNTAIN_IMAGES.length));
    if (isLogin) {
      setCurrentClimber(CLIMBER_IMAGES[randomIndex]);
    } else {
      setCurrentMountain(MOUNTAIN_IMAGES[randomIndex]);
    }
  }, [isLogin]);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [countdown]);

  const handleSendCode = () => {
    if (countdown > 0 || !email) return;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(generated);
    setCountdown(60);
    alert(`验证码已发送至 ${email} (模拟查看控制台: ${generated})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signIn(email, password);
        onLoginSuccess();
      } else {
        // 注册模式下检查验证码
        if (userCode !== verificationCode || verificationCode === '') {
          setShowStatus('error');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
        setShowStatus('success');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || '认证失败，请重试');
      if (!isLogin) {
        setShowStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black overflow-y-auto lg:overflow-hidden font-sans antialiased relative">
      
      {/* 动态背景容器 */}
      <div className="fixed inset-0 h-full w-full overflow-hidden transition-all duration-700 z-0">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Climber" 
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
            src={currentClimber}
          />
          <img 
            alt="Mountain" 
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${!isLogin ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
            src={currentMountain}
          />
        </div>
        
        {/* 全局深色遮罩 */}
        <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[2px]"></div>
      </div>

      {/* 响应式退出按钮：Mobile 端仅保留图标以防遮挡文字，Desktop 端保持完整样式 */}
      <button 
        onClick={onBack}
        className="fixed top-6 right-6 lg:top-10 lg:right-10 z-[60] flex items-center justify-center gap-3 p-3.5 lg:px-6 lg:py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-2xl group transition-all duration-500 active:scale-95 shadow-2xl"
      >
        <span className="material-symbols-outlined text-white/50 group-hover:text-white group-hover:rotate-90 transition-all duration-500 text-lg">close</span>
        <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-all duration-500">Exit Journal</span>
      </button>

      {/* 表单面板容器 */}
      <div className="relative z-20 w-full flex items-center justify-center p-6 md:p-16 min-h-screen">
        
        <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-700">
          
          {/* Logo 区域 */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="size-12 bg-white flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
               <span className="material-symbols-outlined text-black text-2xl">terrain</span>
            </div>
            <span className="text-white text-2xl font-display italic font-bold uppercase tracking-tighter">SUMMIT REACH</span>
          </div>

          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-display font-black mb-4 text-white italic uppercase tracking-tighter leading-none">
              {isLogin ? 'Welcome Back' : 'Join the Matrix'}
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              {isLogin ? 'Satellite connection active' : 'Initiating expedition passport'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="relative group">
                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 ml-1">Full Name</label>
                <input 
                  className="w-full bg-white/[0.03] hover:bg-white/[0.06] border-none rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-accent transition-all outline-none font-medium text-lg placeholder:text-white/10" 
                  placeholder="IDENTIFIER" 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="relative group">
              <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  className="w-full bg-white/[0.03] hover:bg-white/[0.06] border-none rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-accent transition-all outline-none font-medium text-lg placeholder:text-white/10 pr-24" 
                  placeholder="COMM_LINK@EXP.COM" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!isLogin && (
                  <button 
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || !email}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-accent/20 text-accent rounded-xl hover:bg-accent hover:text-black transition-all disabled:opacity-30"
                  >
                    {countdown > 0 ? `${countdown}S` : 'VERIFY'}
                  </button>
                )}
              </div>
            </div>

            {!isLogin && (
              <div className="relative group animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-3 ml-1">Sync Code</label>
                <input 
                  className="w-full bg-white/[0.03] hover:bg-white/[0.06] border-none rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-accent transition-all outline-none font-medium tracking-[0.8em] text-lg placeholder:text-white/10" 
                  placeholder="••••••" 
                  maxLength={6}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  type="text"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Access Key</label>
                {isLogin && <a className="text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-accent transition-colors" href="#">Retrieve</a>}
              </div>
              <input 
                className="w-full bg-white/[0.03] hover:bg-white/[0.06] border-none rounded-2xl px-6 py-5 text-white focus:ring-1 focus:ring-accent transition-all outline-none font-medium text-lg placeholder:text-white/10" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-6">
              <button 
                disabled={loading}
                className="w-full bg-white text-black py-6 px-8 font-black tracking-[0.4em] uppercase text-[11px] hover:bg-accent transition-all duration-500 flex items-center justify-center gap-6 group rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] disabled:opacity-50" 
                type="submit"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                ) : (
                  <>
                    {isLogin ? 'ENGAGE SYSTEM' : 'CREATE PROTOCOL'}
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setShowStatus(null);
                setError(null);
              }}
              className="group text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all flex items-center justify-center mx-auto gap-4"
            >
              <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all"></div>
              {isLogin ? 'NEW EXPEDITION?' : 'EXISTING ARCHIVE?'}
              <span className="text-accent group-hover:text-white">SWITCH</span>
              <div className="h-px w-8 bg-white/10 group-hover:w-12 transition-all"></div>
            </button>
          </div>
        </div>
      </div>

      {/* 状态反馈弹窗 */}
      {showStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm p-12 text-center animate-in zoom-in-95 duration-500">
            {showStatus === 'success' ? (
              <>
                <div className="size-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-accent/30">
                  <span className="material-symbols-outlined text-6xl text-accent animate-pulse">verified</span>
                </div>
                <h2 className="text-4xl font-black font-display italic uppercase tracking-tighter mb-4 text-white">Passport Issued</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-12">Encryption successful</p>
                <button 
                  onClick={onLoginSuccess}
                  className="w-full bg-white text-black py-6 font-black text-[11px] uppercase tracking-[0.5em] hover:bg-accent transition-all rounded-2xl"
                >
                  ENTER BASECAMP
                </button>
              </>
            ) : (
              <>
                <div className="size-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/30">
                  <span className="material-symbols-outlined text-6xl text-red-500">warning</span>
                </div>
                <h2 className="text-4xl font-black font-display italic uppercase tracking-tighter mb-4 text-white">Access Denied</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-12">Signal interference detected</p>
                <button 
                  onClick={() => setShowStatus(null)}
                  className="w-full border border-white/20 py-6 font-black text-[11px] uppercase tracking-[0.5em] text-white hover:bg-white hover:text-black transition-all rounded-2xl"
                >
                  RETRY SYNC
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthView;