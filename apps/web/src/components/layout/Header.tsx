import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Bell, Search, Camera } from 'lucide-react';
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

  return (
    <header className="sticky top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-3 md:px-6 select-none border-b border-[#E5E7EB] bg-white">
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
        {/* Mobile search button */}
        <NavLink
          to="/search"
          className="md:hidden text-brand-text dark:text-gray-100 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </NavLink>

        {/* Theme Switcher */}
        <ThemeSelector />

        {/* Messages Shortcut with Orange Badge */}
        <NavLink
          to="/messages"
          className="relative p-2 text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-95"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5 stroke-[2]" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 bg-[#FF5A1F] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {unreadMessages}
            </span>
          )}
        </NavLink>

        {/* Notifications Shortcut with Orange Badge */}
        <NavLink
          to="/notifications"
          className="relative p-2 text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 rounded-full transition-colors active:scale-95"
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
    </header>
  );
};
