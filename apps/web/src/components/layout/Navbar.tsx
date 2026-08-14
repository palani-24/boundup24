import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  Settings,
  ShieldAlert,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

interface NavbarProps {
  onCreateClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateClick }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const desktopNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Communities', path: '/communities', icon: Users },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Create', path: '#create', icon: PlusSquare, onClick: onCreateClick },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User, isAvatar: true },
    ...(user?.role === 'ADMIN' ? [{ label: 'Admin', path: '/admin', icon: ShieldAlert }] : []),
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const mobileNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Communities', path: '/communities', icon: Users },
    { label: 'Create', path: '#create', icon: PlusSquare, onClick: onCreateClick },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User, isAvatar: true },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-brand-border/60 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-40 px-4 py-6 justify-between select-none">
        <div className="flex flex-col gap-6">
          {/* Logo Branding */}
          <NavLink to="/home" className="px-2">
            <Logo size="md" showTagline={true} />
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-1">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-16px text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-primary transition-all text-sm font-bold min-h-[44px]"
                  >
                    <Icon className="w-5 h-5 stroke-[2] text-brand-primary" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-16px transition-all text-sm font-bold min-h-[44px] ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-primary to-orange-500 text-white shadow-md'
                        : 'text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-primary'
                    }`
                  }
                >
                  {item.isAvatar && user ? (
                    <Avatar src={user.avatarUrl} alt={user.fullName} size="sm" />
                  ) : (
                    <Icon className="w-5 h-5 stroke-[2]" />
                  )}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        {user && (
          <NavLink
            to={`/profile/${user.username}`}
            className="flex items-center gap-3 p-2.5 rounded-16px hover:bg-brand-primary/10 transition-colors border border-brand-border/60 dark:border-slate-800 bg-brand-bg/50 dark:bg-slate-800/50"
          >
            <Avatar src={user.avatarUrl} alt={user.fullName} size="md" />
            <div className="flex flex-col truncate">
              <span className="text-xs font-extrabold text-brand-text dark:text-gray-100 truncate">{user.fullName}</span>
              <span className="text-[11px] text-brand-muted dark:text-slate-400 truncate">@{user.username}</span>
            </div>
          </NavLink>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] glass-nav z-40 flex items-center justify-around px-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-brand-border/60 dark:border-slate-800/80">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center h-full w-14 active:scale-90 transition-transform"
                aria-label="Create Post"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-brand-primary to-orange-500 text-white flex items-center justify-center shadow-lg neon-glow-primary">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className="flex flex-col items-center justify-center h-full w-14 relative active:scale-90 transition-transform"
            >
              {item.isAvatar && user ? (
                <Avatar
                  src={user.avatarUrl}
                  alt={user.fullName}
                  size="sm"
                  className={isActive ? 'ring-2 ring-brand-primary shadow-sm' : ''}
                />
              ) : (
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-brand-primary stroke-[2.5]' : 'text-brand-muted dark:text-slate-400 stroke-[1.8]'
                  }`}
                />
              )}

              {/* Active Glow Dot Indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute bottom-1.5 shadow-sm animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
