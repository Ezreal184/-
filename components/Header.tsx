import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  onNavigate: (view: 'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'chat', query?: string) => void;
  onOpenNotifications: () => void;
  onOpenEditProfile: () => void;
  onOpenPreferences: () => void;
  onOpenProfileDetail: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  currentView: string;
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  onOpenNotifications, 
  onOpenEditProfile, 
  onOpenPreferences, 
  onOpenProfileDetail,
  onLogout, 
  isLoggedIn,
  currentView,
  user
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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('explore', searchQuery);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-black/40 backdrop-blur-3xl px-6 lg:px-20 py-5 border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate(isLoggedIn ? 'profile' : 'community')}>
              <div className="bg-white size-10 flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="material-symbols-outlined text-black text-2xl">terrain</span>
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter font-display text-white uppercase leading-none">SUMMIT REACH</h2>
            </div>

            <nav className="hidden xl:flex items-center gap-12">
              {[
                { id: 'explore', label: 'Explore' },
                { id: 'community', label: 'Journal' },
                { id: 'equipment', label: 'The Vault' },
                { id: 'chat', label: 'Radio' }
              ].map((view) => (
                <button 
                  key={view.id}
                  onClick={() => onNavigate(view.id as any)}
                  className={`relative py-2 text-[10px] font-black uppercase tracking-[0.4em] transition-all
                    ${currentView === view.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
                >
                  {view.label}
                  {currentView === view.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent animate-in fade-in slide-in-from-left duration-500 shadow-[0_0_10px_#22d3ee]" />
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-8">
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex items-center bg-white/[0.03] hover:bg-white/[0.07] px-6 py-3 w-80 rounded-2xl transition-all group/search"
            >
              <button type="submit" className="text-zinc-500 group-focus-within/search:text-white transition-colors">
                <span className="material-symbols-outlined text-base">search</span>
              </button>
              <input 
                className="bg-transparent border-none focus:ring-0 text-[11px] font-bold uppercase tracking-widest w-full placeholder:text-zinc-600 ml-4 text-white" 
                placeholder="Find Peak, Trail..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onOpenNotifications()}
                className="size-12 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all relative"
              >
                <span className="material-symbols-outlined text-zinc-400">notifications</span>
                <span className="absolute top-3.5 right-3.5 size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`size-12 bg-cover bg-center rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl ${isDropdownOpen ? 'ring-2 ring-accent shadow-[0_0_20px_rgba(34,211,238,0.3)]' : ''}`}
                  style={{ backgroundImage: isLoggedIn ? `url('${user.avatarUrl}')` : "none" }}
                >
                  {!isLoggedIn && <span className="material-symbols-outlined text-zinc-500">account_circle</span>}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-64 bg-zinc-900/95 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[2rem] py-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="px-6 py-3 mb-2">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Alpine Passport</p>
                    </div>
                    {isLoggedIn ? (
                      <>
                        <button onClick={() => { onOpenProfileDetail(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5 transition-all">
                          <span className="material-symbols-outlined text-lg">person</span>
                          Profile
                        </button>
                        <button onClick={() => { onOpenEditProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5 transition-all">
                          <span className="material-symbols-outlined text-lg">settings</span>
                          Settings
                        </button>
                        <button onClick={() => { onLogout(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all">
                          <span className="material-symbols-outlined text-lg">logout</span>
                          Exit
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { onNavigate('auth'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white hover:bg-accent hover:text-black transition-all">
                        <span className="material-symbols-outlined text-lg">login</span>
                        Sign In
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden size-12 flex items-center justify-center bg-white/[0.03] rounded-2xl">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden flex animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-80 h-full bg-zinc-950 p-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-700">
            <div className="flex items-center gap-4 mb-20">
              <span className="material-symbols-outlined text-white text-4xl">terrain</span>
              <h2 className="text-xl font-black italic tracking-tighter font-display text-white uppercase">SUMMIT REACH</h2>
            </div>
            
            <nav className="flex flex-col gap-12">
              {['explore', 'community', 'equipment', 'chat'].map((v) => (
                <button 
                  key={v}
                  onClick={() => onNavigate(v as any)}
                  className={`text-left text-2xl font-black uppercase tracking-widest ${currentView === v ? 'text-accent' : 'text-zinc-600'}`}
                >
                  {v === 'chat' ? 'Radio' : v === 'explore' ? 'Explore' : v === 'equipment' ? 'The Vault' : 'Journal'}
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