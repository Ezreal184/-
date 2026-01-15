import React from 'react';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ isOpen, onClose, onGoToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        {/* 顶部装饰条 */}
        <div className="h-1 bg-primary dark:bg-white w-full" />
        
        <div className="p-10 text-center">
          <div className="size-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:rotate-12">
            <span className="material-symbols-outlined text-4xl text-zinc-400 dark:text-zinc-500">lock</span>
          </div>
          
          <h2 className="text-2xl font-black font-display italic uppercase tracking-tighter mb-4 dark:text-white">
            孤高的登山者
          </h2>
          
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-10 font-medium">
            前方区域由于暴风雪封锁，仅限已认证的探险家通行。<br/>请先登录以继续您的征程。
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={onGoToLogin}
              className="w-full bg-primary dark:bg-white text-white dark:text-black py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg"
            >
              前往大本营登录
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 text-zinc-400 dark:text-zinc-600 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
            >
              稍后再说
            </button>
          </div>
        </div>
        
        {/* 背景底纹 */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
          <span className="material-symbols-outlined text-[12rem]">terrain</span>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
