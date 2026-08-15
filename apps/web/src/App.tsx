import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/layout/Navbar';
import { Header } from './components/layout/Header';
import { CreatePostModal } from './components/feed/CreatePostModal';

// Pages
import { SplashScreen } from './pages/SplashScreen';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { StoryViewerPage } from './pages/StoryViewerPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { CreateVoicePostPage } from './pages/CreateVoicePostPage';
import { CreatePhotoPostPage } from './pages/CreatePhotoPostPage';
import { CreateReelPostPage } from './pages/CreateReelPostPage';
import { ReelsPage } from './pages/ReelsPage';
import { MessagesPage } from './pages/MessagesPage';
import { DirectChatPage } from './pages/DirectChatPage';
import { GroupChatPage } from './pages/GroupChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { FollowersPage } from './pages/FollowersPage';
import { FollowingPage } from './pages/FollowingPage';
import { LiveAudioRoomPage } from './pages/LiveAudioRoomPage';
import { SettingsPage } from './pages/SettingsPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { PrivacySettingsPage } from './pages/PrivacySettingsPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { AppearanceSettingsPage } from './pages/AppearanceSettingsPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { AboutBoundUpPage } from './pages/AboutBoundUpPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { HashtagPage } from './pages/HashtagPage';
import { Radio } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const location = useLocation();

  // Fullscreen standalone mobile pages (no header/footer overlay)
  const isFullscreenPage =
    location.pathname === '/splash' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/story/') ||
    location.pathname.startsWith('/live/');

  return (
    <div className="min-h-screen w-full bg-[#FAFAFC] text-[#111111] flex flex-col justify-between">
      {!isFullscreenPage && <Header onCreateClick={() => setIsCreateOpen(true)} />}

      <div className={`flex-1 w-full ${isFullscreenPage ? '' : 'max-w-[1280px] mx-auto md:pl-64 pb-16 md:pb-6'}`}>
        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/home" element={<HomePage onCreateClick={() => setIsCreateOpen(true)} />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/results" element={<SearchResultsPage />} />
            <Route path="/story/:id" element={<StoryViewerPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/create/voice" element={<CreateVoicePostPage />} />
            <Route path="/create/photo" element={<CreatePhotoPostPage />} />
            <Route path="/create/reel" element={<CreateReelPostPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/direct/:id" element={<DirectChatPage />} />
            <Route path="/messages/group/:id" element={<GroupChatPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/:username/followers" element={<FollowersPage />} />
            <Route path="/profile/:username/following" element={<FollowingPage />} />
            <Route path="/live/:id" element={<LiveAudioRoomPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/account" element={<AccountSettingsPage />} />
            <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
            <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
            <Route path="/settings/appearance" element={<AppearanceSettingsPage />} />
            <Route path="/settings/help" element={<HelpSupportPage />} />
            <Route path="/settings/about" element={<AboutBoundUpPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/hashtag/:tag" element={<HashtagPage />} />
          </Routes>
        </main>
      </div>

      {!isFullscreenPage && <Navbar onCreateClick={() => setIsCreateOpen(true)} />}

      {/* CREATE POST MODAL */}
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};
