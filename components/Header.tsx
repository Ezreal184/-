
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onNavigate: (view: 'profile' | 'explore' | 'community' | 'equipment' | 'auth', query?: string) => void;
  onOpenNotifications: () => void;
  onOpenEditProfile: () => void;
  onOpenPreferences: () => void;
  onOpenProfileDetail: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  onOpenNotifications, 
  onOpenEditProfile, 
  onOpenPreferences, 
  onOpenProfileDetail,
  onLogout, 
  isLoggedIn,
  currentView 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('explore', searchQuery);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-100 dark:border-zinc-800/50 px-6 lg:px-20 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(isLoggedIn ? 'profile' : 'community')}>
              <div className="bg-primary dark:bg-white size-9 flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-white dark:text-black text-2xl">terrain</span>
              </div>
              <h2 className="text-xl font-black italic tracking-tighter font-display text-zinc-900 dark:text-white uppercase">SUMMIT REACH</h2>
            </div>

            <nav className="hidden xl:flex items-center gap-10">
              {[
                { id: 'explore', label: '探索' },
                { id: 'community', label: '社区' },
                { id: 'equipment', label: '装备库' }
              ].map((view) => (
                <button 
                  key={view.id}
                  onClick={() => onNavigate(view.id as any)}
                  className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${currentView === view.id ? 'text-primary dark:text-white' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                >
                  {view.label}
                  {currentView === view.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-white animate-in slide-in-from-left duration-300" />
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            {/* 增强型搜索框 */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 w-72 border border-transparent focus-within:border-primary dark:focus-within:border-white focus-within:ring-4 focus-within:ring-primary/5 dark:focus-within:ring-white/5 transition-all relative overflow-hidden group/search"
            >
              <button 
                type="submit" 
                className="flex items-center justify-center text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">search</span>
              </button>
              
              <input 
                className="bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-wider w-full placeholder:text-zinc-500 ml-2" 
                placeholder="搜索高峰, 路线..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="flex items-center justify-center text-zinc-300 hover:text-zinc-500 transition-colors animate-in fade-in zoom-in-75 duration-200"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </form>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onOpenNotifications()}
                className="size-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
              >
                <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`size-10 bg-cover bg-center border-2 transition-all hover:scale-105 active:scale-95 ${isDropdownOpen ? 'border-primary dark:border-white ring-4 ring-primary/5' : 'border-zinc-100 dark:border-zinc-800'}`}
                  style={{ backgroundImage: isLoggedIn ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8-kXoXZ49wx_QN3-9zWISllnAfGrJ6rzUpEyMgf-ml-9RvkiahYLgz9-yGA_BRSfI-8dEbyWMfqPFEtmfaGbqgs7Vn63giSmt2nbO9vpPjqaiQBbE-V10zqYVGV84yoYm47AhUV5zVPkpAAv_VSKFIXf9ImPMkrtAciKsp1jzj8r-4a9aXMrOiSxxCKd3QZYK5lpSqo9v5kApkT7TDMYxQRHDvmrIBW7BxN8YvwnnC3QCV6pm7bWaQVIC9lAabsbVoAS6fE604r8')" : "none" }}
                >
                  {!isLoggedIn && <span className="material-symbols-outlined text-zinc-400">account_circle</span>}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800 py-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-3 border-b border-zinc-50 dark:border-zinc-800 mb-2">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">探险家账户</p>
                    </div>
                    {isLoggedIn ? (
                      <>
                        <button onClick={() => { onOpenProfileDetail(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                          <span className="material-symbols-outlined text-lg">person</span>
                          个人主页
                        </button>
                        <button onClick={() => { onOpenEditProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                          <span className="material-symbols-outlined text-lg">settings</span>
                          账户设置
                        </button>
                        <button onClick={() => { onLogout(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <span className="material-symbols-outlined text-lg">logout</span>
                          登出
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { onNavigate('auth'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-primary dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">login</span>
                        立即登录
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden size-10 flex items-center justify-center">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-white dark:bg-zinc-950 p-8 flex flex-col shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-3 mb-16">
              <span className="material-symbols-outlined text-primary dark:text-white text-3xl">terrain</span>
              <h2 className="text-lg font-black italic tracking-tighter font-display dark:text-white uppercase">SUMMIT REACH</h2>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-3 mb-12 border border-transparent focus-within:border-primary">
              <span className="material-symbols-outlined text-zinc-400 text-sm">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-wider w-full placeholder:text-zinc-500 ml-2" 
                placeholder="搜索..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <nav className="flex flex-col gap-8">
              {['explore', 'community', 'equipment'].map((v) => (
                <button 
                  key={v}
                  onClick={() => onNavigate(v as any)}
                  className={`text-left text-lg font-black uppercase tracking-widest ${currentView === v ? 'text-primary dark:text-white' : 'text-zinc-400'}`}
                >
                  {v === 'equipment' ? '装备库' : v === 'explore' ? '探索' : '社区动态'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
