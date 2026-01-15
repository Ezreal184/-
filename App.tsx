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
import PostDetailView from './components/PostDetailView';
import AtmosphericOverlay from './components/AtmosphericOverlay';
import ChatView from './components/ChatView';
import { TabType, UserProfile } from './types';
import { MOCK_USER } from './constants';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isLandingPage, setIsLandingPage] = useState(!isLoggedIn);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSTS);
  const [mainView, setMainView] = useState<'profile' | 'explore' | 'community' | 'equipment' | 'auth' | 'other-profile' | 'post-detail' | 'chat'>('community');
  const [viewTransitioning, setViewTransitioning] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('summit_reach_user_profile');
    return savedProfile ? JSON.parse(savedProfile) : MOCK_USER;
  });
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setIsLandingPage(false);
      if (mainView === 'auth') {
        setMainView('community');
      }
    } else {
      setIsLandingPage(true);
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    setViewTransitioning(true);
    try {
      await logout();
      setTimeout(() => {
        setMainView('community');
        setIsLandingPage(true);
        setViewTransitioning(false);
      }, 800);
    } catch (error) {
      console.error('Logout failed:', error);
      setViewTransitioning(false);
    }
  };

  const handleLoginSuccess = () => {
    setMainView('profile');
    setIsAuthModalOpen(false);
    setIsLandingPage(false);
  };

  const handleUpdateProfile = (newData: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('summit_reach_user_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const handleStartJourney = () => {
    setViewTransitioning(true);
    setTimeout(() => {
      setIsLandingPage(false);
      setMainView(isLoggedIn ? 'profile' : 'community');
      setViewTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleNavigation = (view: any, payload?: any) => {
    if ((view === 'chat') && !isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setViewTransitioning(true);
    setTimeout(() => {
      if (view === 'auth') {
        setMainView('auth');
      } else if (view === 'other-profile') {
        setSelectedUser(payload);
        setMainView('other-profile');
      } else if (view === 'post-detail') {
        setSelectedPost({ ...payload, currentUserAvatar: userProfile.avatarUrl });
        setMainView('post-detail');
      } else {
        setMainView(view);
        if (typeof payload === 'string') setInitialSearchQuery(payload);
      }
      setIsLandingPage(false);
      setViewTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const renderMainContent = () => {
    if (isLandingPage) return <LandingView onStart={handleStartJourney} />;
    if (mainView === 'auth') return <AuthView onLoginSuccess={handleLoginSuccess} onBack={() => setMainView('community')} />;

    switch (mainView) {
      case 'profile':
        return (
          <div className="pb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <ProfileHero user={userProfile} onEdit={() => setIsEditProfileOpen(true)} />
            <StatsBar user={userProfile} />
            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 mt-32">
              <div className="flex justify-center overflow-x-auto no-scrollbar mb-20">
                <div className="flex bg-white/5 p-2 rounded-3xl backdrop-blur-3xl">
                  {[
                    { id: TabType.POSTS, label: 'Journal', icon: 'grid_view' }, 
                    { id: TabType.TRAILS, label: 'Trail Maps', icon: 'explore' }, 
                    { id: TabType.GEAR, label: 'Core Gear', icon: 'handyman' }
                  ].map((tab) => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveTab(tab.id)} 
                      className={`px-10 py-5 rounded-2xl transition-all text-[10px] font-black tracking-[0.4em] uppercase whitespace-nowrap flex items-center gap-3 ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="reveal-on-scroll">
                {activeTab === TabType.POSTS && <PostGrid onNavigate={handleNavigation} onAuthRequired={() => setIsAuthModalOpen(true)} isLoggedIn={isLoggedIn} />}
                {activeTab === TabType.TRAILS && <div className="h-[70vh] rounded-[4rem] overflow-hidden shadow-2xl"><MapView /></div>}
              </div>
            </div>
          </div>
        );
      case 'chat':
        return <ChatView />;
      case 'other-profile':
        return <PublicProfileView user={selectedUser} onBack={() => setMainView('community')} isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)} />;
      case 'explore':
        return <ExploreView initialQuery={initialSearchQuery} onNavigate={handleNavigation} isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)} />;
      case 'equipment':
        return <EquipmentView onNavigate={handleNavigation} isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)} />;
      case 'post-detail':
        return <PostDetailView post={selectedPost} onBack={() => setMainView('community')} isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)} />;
      case 'community':
      default:
        return <CommunityView onNavigate={handleNavigation} isLoggedIn={isLoggedIn} onAuthRequired={() => setIsAuthModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-black">
      <AtmosphericOverlay />
      
      {mainView !== 'auth' && mainView !== 'post-detail' && (
        <Header 
          onNavigate={handleNavigation} 
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
          onOpenProfileDetail={() => setIsProfileDetailOpen(true)}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          currentView={isLandingPage ? 'landing' : mainView} 
          user={userProfile} 
        />
      )}
      
      <main className={`flex-1 relative transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${viewTransitioning ? 'opacity-0 scale-[1.05] blur-[40px]' : 'opacity-100 scale-100 blur-0'}`}>
        {renderMainContent()}
      </main>

      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={userProfile} onSave={handleUpdateProfile} />
      <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
      <ProfileDetailModal user={userProfile} isOpen={isProfileDetailOpen} onClose={() => setIsProfileDetailOpen(false)} />
      <LoginRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onGoToLogin={() => { setIsAuthModalOpen(false); setMainView('auth'); }} />
    </div>
  );
};

export default App;