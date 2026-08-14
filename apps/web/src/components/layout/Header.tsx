import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, MessageSquare, Bell, Search, Compass } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../ui/Logo';
import { ThemeSelector } from '../ui/ThemeSelector';

interface HeaderProps {
  onCreateClick?: () => void;
  unreadNotifications?: number;
  unreadMessages?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateClick,
  unreadNotifications = 0,
  unreadMessages = 0,
}) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 left-0 right-0 h-14 glass-header z-40 flex items-center justify-between px-3 md:px-8 select-none border-b border-brand-border/60 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
      {/* Mobile Left Camera Action */}
      <div className="flex items-center gap-1">
        <button
          onClick={onCreateClick}
          className="md:hidden text-brand-text dark:text-gray-100 p-2 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-90"
          aria-label="Create Post"
        >
          <Camera className="w-5 h-5 text-brand-primary" />
        </button>

        {/* Quick Search Shortcut for Mobile */}
        <NavLink
          to="/search"
          className="md:hidden text-brand-text dark:text-gray-100 p-2 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-90"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </NavLink>
      </div>

      {/* Brand Logo */}
      <NavLink to="/home" className="flex items-center gap-2">
        <Logo size="sm" showTagline={false} />
      </NavLink>

      {/* Action Icons */}
      <div className="flex items-center gap-1">
        <ThemeSelector />

        <NavLink
          to="/explore"
          className="hidden sm:flex relative p-2 text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 rounded-full transition-colors"
          aria-label="Explore"
        >
          <Compass className="w-5 h-5 stroke-[2]" />
        </NavLink>

        <NavLink
          to="/notifications"
          className="relative p-2 text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-90"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/messages"
          className="relative p-2 text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-90"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5 stroke-[2]" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
};
