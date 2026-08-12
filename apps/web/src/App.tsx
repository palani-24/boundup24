import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/layout/Navbar';
import { Header } from './components/layout/Header';
import { CreatePostModal } from './components/feed/CreatePostModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { ReelsPage } from './pages/ReelsPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { HashtagPage } from './pages/HashtagPage';
import { AdminPage } from './pages/AdminPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LiveStreamModal } from './components/live/LiveStreamModal';
import { Radio } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <span className="font-heading font-extrabold text-3xl text-brand-primary animate-pulse">BOUNDUP</span>
          <span className="text-xs font-semibold text-brand-muted">Loading application...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const location = useLocation();

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
        {/* TOP HEADER */}
        <Header onCreateClick={() => setIsCreateOpen(true)} />

        {/* MAIN BODY CONTAINER WITH DESKTOP SIDEBAR OFFSET */}
        <div className="flex-1 flex w-full max-w-[1200px] mx-auto md:pl-64 pb-20 md:pb-6">
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage onCreateClick={() => setIsCreateOpen(true)} />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:conversationId" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/hashtag/:tag" element={<HashtagPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>

        {/* FLOATING LIVE STREAM LAUNCHER BUTTON */}
        <button
          onClick={() => setIsLiveOpen(true)}
          className="fixed bottom-20 right-5 md:bottom-6 md:right-6 z-40 bg-red-600 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:bg-red-700 transition-transform active:scale-95 animate-pulse"
          title="Join / Go Live"
        >
          <Radio className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Go Live</span>
        </button>

        {/* NAVIGATION (DESKTOP SIDEBAR + MOBILE BOTTOM BAR) */}
        <Navbar onCreateClick={() => setIsCreateOpen(true)} />

        {/* CREATE POST MODAL */}
        <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

        {/* LIVE STREAM MODAL */}
        <LiveStreamModal
          isOpen={isLiveOpen}
          roomId="boundup-main-stage"
          hostName="Elena Vance"
          onClose={() => setIsLiveOpen(false)}
        />
      </div>
    </ProtectedRoute>
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
