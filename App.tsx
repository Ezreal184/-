import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProfileHero from './components/ProfileHero';
import StatsBar from './components/StatsBar';
import PostGrid from './components/PostGrid';
import ExploreView from './components/ExploreView';
import CommunityView from './components/CommunityView';
import EquipmentView from './components/EquipmentView';
import MapView from './components/MapView';
import NotificationsDrawer from './components/NotificationsDrawer';
import EditProfileModal from './components/EditProfileModal';
import PreferencesModal from './components/PreferencesModal';
import ProfileDetailModal from './components/ProfileDetailModal';
import LoginRequiredModal from './components/LoginRequiredModal';
import AuthView from './components/AuthView';
import PublicProfileView from './components/PublicProfileView';
import LandingView from './components/LandingView';
import { TabType, UserProfile } from './types';
import { MOCK_USER } from './constants';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSTS);
  const [mainView, setMainView] = useState<'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'other-profile'>('community');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // 用户动态资料状态
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  // 检查是否已登录过（用于跳过 landing page）
  useEffect(() => {
    if (isAuthenticated) {
      setIsLandingPage(false);
      setMainView('community');
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setTimeout(() => {
      setIsLoggingOut(false);
      setMainView('community');
      setIsLandingPage(true);
    }, 1500);
  };

  const handleLoginSuccess = () => {
    setMainView('profile');
    setIsAuthModalOpen(false);
    setIsLandingPage(false);
  };

  const handleUpdateProfile = (newData: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...newData }));
  };

  const handleStartJourney = () => {
    setIsLandingPage(false);
    if (!isAuthenticated) {
      setMainView('community');
    } else {
      setMainView('profile');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (view: 'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'other-profile', payload?: any) => {
    if (view === 'auth') {
      setMainView('auth');
      setIsLandingPage(false);
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
    setIsLandingPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const renderProfileTabContent = () => {
    switch (activeTab) {
      case TabType.TRAILS:
        return (
          <div className="mt-8 h-[600px] border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
            <MapView />
          </div>
        );
      case TabType.GEAR:
        return (
          <div className="py-12 text-center text-zinc-400">
             <span className="material-symbols-outlined text-6xl mb-4">handyman</span>
             <p className="font-bold uppercase tracking-widest text-xs">您的核心装备清单正在同步中...</p>
          </div>
        );
      case TabType.POSTS:
      default:
        return <PostGrid onNavigate={handleNavigation} onAuthRequired={handleAuthRequired} isLoggedIn={isAuthenticated} />;
    }
  };

  const renderMainContent = () => {
    if (isLandingPage) {
      return <LandingView onStart={handleStartJourney} />;
    }

    if (mainView === 'auth') {
      return <AuthView onLoginSuccess={handleLoginSuccess} onBack={() => {
        if (isAuthenticated) setMainView('profile');
        else {
          setIsLandingPage(true);
          setMainView('community');
        }
      }} />;
    }

    switch (mainView) {
      case 'profile':
        return (
          <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileHero user={userProfile} onEdit={() => setIsEditProfileOpen(true)} />
            <StatsBar user={userProfile} />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 mt-16">
              <div className="flex border-b border-zinc-100 dark:border-zinc-800 justify-center overflow-x-auto no-scrollbar">
                {[
                  { id: TabType.POSTS, label: '探险记录', icon: 'grid_view' }, 
                  { id: TabType.TRAILS, label: '地图踪迹', icon: 'explore' }, 
                  { id: TabType.GEAR, label: '核心装备', icon: 'handyman' }
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`px-8 lg:px-12 py-6 border-b-2 transition-all text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'border-primary text-primary dark:text-white dark:border-white' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="min-h-[400px]">
                {renderProfileTabContent()}
              </div>
            </div>
          </div>
        );
      case 'other-profile':
        return <PublicProfileView user={selectedUser} onBack={() => setMainView('community')} isLoggedIn={isAuthenticated} onAuthRequired={handleAuthRequired} />;
      case 'explore':
        return <ExploreView initialQuery={initialSearchQuery} onNavigate={handleNavigation} isLoggedIn={isAuthenticated} onAuthRequired={handleAuthRequired} />;
      case 'equipment':
        return <EquipmentView onNavigate={handleNavigation} isLoggedIn={isAuthenticated} onAuthRequired={handleAuthRequired} />;
      case 'community':
      default:
        return <CommunityView onNavigate={handleNavigation} isLoggedIn={isAuthenticated} onAuthRequired={handleAuthRequired} />;
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 selection:bg-primary selection:text-white">
      {mainView !== 'auth' && !isLandingPage && (
        <Header 
          onNavigate={handleNavigation} 
          onOpenNotifications={() => isAuthenticated ? setIsNotificationsOpen(true) : handleAuthRequired()}
          onOpenEditProfile={() => isAuthenticated ? setIsEditProfileOpen(true) : handleAuthRequired()}
          onOpenPreferences={() => isAuthenticated ? setIsPreferencesOpen(true) : handleAuthRequired()}
          onOpenProfileDetail={() => isAuthenticated ? setIsProfileDetailOpen(true) : handleAuthRequired()}
          onLogout={handleLogout}
          isLoggedIn={isAuthenticated}
          currentView={isLandingPage ? 'landing' : mainView} 
          user={userProfile}
        />
      )}
      
      <main className="flex-1 overflow-x-hidden relative">
        {isLoggingOut && (
          <div className="fixed inset-0 z-[200] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="size-16 border-4 border-zinc-200 border-t-primary rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">正在安全退出大本营...</p>
          </div>
        )}

        <div className={`transition-opacity duration-500 ${isLoggingOut ? 'opacity-20' : 'opacity-100'}`}>
          {renderMainContent()}
        </div>

        {!isAuthenticated && !isLandingPage && mainView !== 'auth' && mainView !== 'community' && (
          <div 
            className="absolute inset-0 z-10 cursor-pointer bg-black/5" 
            onClick={(e) => {
              e.stopPropagation();
              handleAuthRequired();
            }}
          />
        )}
      </main>

      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        user={userProfile}
        onSave={handleUpdateProfile}
      />
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
      <ProfileDetailModal user={userProfile} isOpen={isProfileDetailOpen} onClose={() => setIsProfileDetailOpen(false)} />
      <LoginRequiredModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onGoToLogin={() => {
          setIsAuthModalOpen(false);
          setMainView('auth');
          setIsLandingPage(false);
        }} 
      />

      {!isLandingPage && (
        <footer className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/50 py-20 px-6 lg:px-20">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-white text-3xl">terrain</span>
                <h3 className="text-2xl font-black italic font-display text-zinc-900 dark:text-white uppercase">SUMMIT REACH</h3>
              </div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest max-w-xs text-center md:text-left">致敬每一位勇敢向上的探索者。地表最强攀登社区。</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">© 2024 SUMMIT REACH • BEYOND ALL LIMITS</p>
              <p className="text-[9px] text-zinc-300 dark:text-zinc-700 font-bold uppercase tracking-2em">Crafted with Precision by Alpine Systems</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
