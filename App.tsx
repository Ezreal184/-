
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProfileHero from './components/ProfileHero';
import StatsBar from './components/StatsBar';
import PostGrid from './components/PostGrid';
import ExploreView from './components/ExploreView';
import CommunityView from './components/CommunityView';
import EquipmentView from './components/EquipmentView';
import NotificationsDrawer from './components/NotificationsDrawer';
import EditProfileModal from './components/EditProfileModal';
import PreferencesModal from './components/PreferencesModal';
import ProfileDetailModal from './components/ProfileDetailModal';
import AuthView from './components/AuthView';
import PublicProfileView from './components/PublicProfileView';
import { TabType } from './types';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSTS);
  const [mainView, setMainView] = useState<'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'other-profile'>('community');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    setMainView('community');
  };

  const handleLoginSuccess = () => {
    setMainView('profile');
  };

  const handleStartJourney = () => {
    setIsLandingPage(false);
    setMainView('community');
  };

  const handleNavigation = (view: 'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'other-profile', payload?: any) => {
    // 拦截鉴权
    if (!isAuthenticated && ['profile', 'equipment'].includes(view)) {
      setMainView('auth');
      return;
    }
    
    if (view === 'other-profile') {
      setSelectedUser(payload);
    } else if (typeof payload === 'string') {
      setInitialSearchQuery(payload);
    } else {
      setInitialSearchQuery('');
    }
    
    setMainView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 显示加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-white flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl animate-spin">progress_activity</span>
          <p className="text-sm uppercase tracking-widest">加载中...</p>
        </div>
      </div>
    );
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-zinc-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite]" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBuGaEDc95CKZHu90GtlLtAdtt1A_WNBYVF-QiZ21_8YHYzTzd8oLJRT2AO5wSO_YOLHPJGAfaF3-dg0uHOvYfnarJKmaiub8V_vPnm8pJnR3xCGx2c_Jj3HqD5AHS999BpYMIupO23rlKZcm9NXuGQMDgNMTuOM8_NVcaALSGi9jdb8yCBsJjHI4L4xQuJJPdwgo7qQGxt9islZ4KR0-YfFIpEZypxSIjLzu4CHKnplpoZvU9hvEJ0zT0cRL8apFo2I62BODOZXg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950"></div>
        
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <div className="text-white size-24 mx-auto mb-10 drop-shadow-2xl animate-bounce">
            <span className="material-symbols-outlined text-8xl">terrain</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black font-display italic text-white tracking-tighter mb-4 uppercase leading-none">SUMMIT REACH</h1>
          <p className="text-zinc-400 text-lg md:text-2xl font-medium mb-16 tracking-wide">
            为地表极限攀登者打造的数字避风港
          </p>
          <button 
            onClick={handleStartJourney}
            className="group relative inline-flex items-center gap-4 bg-white text-zinc-950 px-16 py-6 rounded-none font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-200 transition-all active:scale-95"
          >
            开启您的征程
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  if (mainView === 'auth') {
    return <AuthView onLoginSuccess={handleLoginSuccess} onBack={() => setMainView('community')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 selection:bg-primary selection:text-white">
      <Header 
        onNavigate={handleNavigation} 
        onOpenNotifications={() => isAuthenticated ? setIsNotificationsOpen(true) : setMainView('auth')}
        onOpenEditProfile={() => isAuthenticated ? setIsEditProfileOpen(true) : setMainView('auth')}
        onOpenPreferences={() => isAuthenticated ? setIsPreferencesOpen(true) : setMainView('auth')}
        onOpenProfileDetail={() => isAuthenticated ? setIsProfileDetailOpen(true) : setMainView('auth')}
        onLogout={handleLogout}
        isLoggedIn={isAuthenticated}
        currentView={mainView} 
      />
      
      <main className="flex-1 overflow-x-hidden">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {mainView === 'profile' ? (
            <div className="pb-20">
              <ProfileHero onEdit={() => setIsEditProfileOpen(true)} />
              <StatsBar />
              <div className="max-w-[1400px] mx-auto px-6 lg:px-20 mt-16">
                <div className="flex border-b border-zinc-100 dark:border-zinc-800 justify-center">
                  {[
                    { id: TabType.POSTS, label: '探险记录', icon: 'grid_view' }, 
                    { id: TabType.TRAILS, label: '地图踪迹', icon: 'explore' }, 
                    { id: TabType.GEAR, label: '核心装备', icon: 'handyman' }
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-12 py-6 border-b-2 transition-all text-[11px] font-black tracking-[0.3em] uppercase ${activeTab === tab.id ? 'border-primary text-primary dark:text-white dark:border-white' : 'border-transparent text-zinc-400'}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <PostGrid onNavigate={handleNavigation} isLoggedIn={isAuthenticated} />
              </div>
            </div>
          ) : mainView === 'other-profile' ? (
            <PublicProfileView user={selectedUser} onBack={() => setMainView('community')} isLoggedIn={isAuthenticated} />
          ) : mainView === 'explore' ? (
            <ExploreView initialQuery={initialSearchQuery} onNavigate={handleNavigation} isLoggedIn={isAuthenticated} />
          ) : mainView === 'community' ? (
            <CommunityView onNavigate={handleNavigation} isLoggedIn={isAuthenticated} />
          ) : (
            <EquipmentView onNavigate={handleNavigation} isLoggedIn={isAuthenticated} />
          )}
        </div>
      </main>

      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
      <ProfileDetailModal isOpen={isProfileDetailOpen} onClose={() => setIsProfileDetailOpen(false)} />

      <footer className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/50 py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-white text-3xl">terrain</span>
              <h3 className="text-2xl font-black italic font-display text-zinc-900 dark:text-white uppercase">SUMMIT REACH</h3>
            </div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest max-w-xs text-center md:text-left">致敬每一位勇敢向上的探索者。</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">© 2024 SUMMIT REACH • NO LIMITS</p>
            <p className="text-[9px] text-zinc-300 dark:text-zinc-700 font-bold uppercase tracking-[0.2em]">Crafted by Alpine Design Systems</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
