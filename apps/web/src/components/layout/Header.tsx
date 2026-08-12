import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, MessageSquare, Bell } from 'lucide-react';
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
    <header className="sticky top-0 left-0 right-0 h-14 glass-header z-30 flex items-center justify-between px-4 md:px-8 select-none">
      {/* Mobile Left Camera Action */}
      <button
        onClick={onCreateClick}
        className="md:hidden text-brand-text p-2 hover:bg-brand-primary/10 rounded-full transition-colors"
        aria-label="Create Post"
      >
        <Camera className="w-6 h-6 stroke-[2]" />
      </button>

      {/* Brand Logo */}
      <NavLink to="/home" className="flex items-center gap-2">
        <Logo size="sm" showTagline={false} />
      </NavLink>

      {/* Action Icons */}
      <div className="flex items-center gap-1">
        <ThemeSelector />

        <NavLink
          to="/notifications"
          className="relative p-2 text-brand-text hover:bg-brand-primary/10 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 stroke-[2]" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/messages"
          className="relative p-2 text-brand-text hover:bg-brand-primary/10 rounded-full transition-colors"
          aria-label="Messages"
        >
          <MessageSquare className="w-6 h-6 stroke-[2]" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
};
