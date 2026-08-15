import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Bell, Search, Download } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../ui/Logo';
import { ThemeSelector } from '../ui/ThemeSelector';
import { Avatar } from '../ui/Avatar';

interface HeaderProps {
  onCreateClick?: () => void;
  unreadNotifications?: number;
  unreadMessages?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateClick,
  unreadNotifications = 3,
  unreadMessages = 8,
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install BoundUp on your mobile or desktop: Tap browser menu (⋮) and select "Add to Home screen" or "Install App".');
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full border-b border-[#E5E7EB] bg-white select-none">
      <div className="w-full max-w-[1280px] mx-auto md:pl-64 h-14 px-3.5 sm:px-6 flex items-center justify-between">
        {/* MOBILE BRAND LOGO */}
        <div className="flex items-center gap-2 md:hidden">
        <NavLink to="/home" className="flex items-center gap-2">
          <Logo size="sm" showTagline={false} />
        </NavLink>
      </div>

      {/* DESKTOP SEARCH INPUT FIELD (IMAGE 3) */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search BoundUp"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`);
              }
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F7F7] border border-[#E5E7EB] focus:border-[#FF5A1F] rounded-full text-xs text-[#111111] placeholder:text-[#666666] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ACTION ICONS & USER PROFILE (RIGHT SIDE OF TOP HEADER) */}
      <div className="flex items-center gap-2">
        {/* PWA Install App Button */}
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5A1F] text-white hover:bg-[#e04d16] rounded-full text-xs font-extrabold shadow-sm transition-all active:scale-95"
          title="Install BoundUp on Mobile / Desktop"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Install App</span>
        </button>
        {/* Mobile search button */}
        <NavLink
          to="/search"
          className="md:hidden text-[#111111] p-2 hover:bg-orange-50 rounded-full transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[2] text-[#111111]" />
        </NavLink>

        {/* Messages Shortcut with Orange Badge */}
        <NavLink
          to="/messages"
          className="relative p-2 text-[#111111] hover:bg-orange-50 rounded-full transition-colors active:scale-95"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5 stroke-[2] text-[#111111]" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 bg-[#FF5A1F] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadMessages}
            </span>
          )}
        </NavLink>

        {/* Notifications Shortcut with Orange Badge */}
        <NavLink
          to="/notifications"
          className="relative p-2 text-[#111111] hover:bg-orange-50 rounded-full transition-colors active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 bg-[#FF5A1F] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadNotifications}
            </span>
          )}
        </NavLink>

        {/* User Profile Avatar Pill */}
        {user && (
          <NavLink
            to={`/profile/${user.username}`}
            className="ml-1 p-0.5 rounded-full ring-2 ring-brand-primary/40 hover:ring-brand-primary transition-all"
          >
            <Avatar src={user.avatarUrl} alt={user.fullName} size="sm" />
          </NavLink>
        )}
      </div>
    </div>
  </header>
);
};
