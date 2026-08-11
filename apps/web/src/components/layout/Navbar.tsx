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
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Create', path: '#create', icon: PlusSquare, onClick: onCreateClick },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User, isAvatar: true },
    ...(user?.role === 'ADMIN' ? [{ label: 'Admin', path: '/admin', icon: ShieldAlert }] : []),
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const mobileNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Create', path: '#create', icon: PlusSquare, onClick: onCreateClick },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User, isAvatar: true },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-brand-border bg-white/90 backdrop-blur-md z-40 px-4 py-6 justify-between select-none">
        <div className="flex flex-col gap-6">
          {/* Logo Branding */}
          <NavLink to="/home" className="px-2">
            <Logo size="md" showTagline={true} />
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-16px text-brand-text hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-sm font-semibold min-h-[44px]"
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3 py-3 rounded-16px transition-colors text-sm font-semibold min-h-[44px] ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-soft'
                        : 'text-brand-text hover:bg-brand-primary/10 hover:text-brand-primary'
                    }`
                  }
                >
                  {item.isAvatar && user ? (
                    <Avatar src={user.avatarUrl} alt={user.fullName} size="sm" />
                  ) : (
                    <Icon className="w-6 h-6 stroke-[2]" />
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
            className="flex items-center gap-3 p-2.5 rounded-16px hover:bg-brand-primary/5 transition-colors border border-brand-border/40"
          >
            <Avatar src={user.avatarUrl} alt={user.fullName} size="md" />
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-brand-text truncate">{user.fullName}</span>
              <span className="text-[11px] text-brand-muted truncate">@{user.username}</span>
            </div>
          </NavLink>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] glass-nav z-40 flex items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center h-full w-14 text-brand-text active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-ambient">
                  <Icon className="w-6 h-6" />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className="flex flex-col items-center justify-center h-full w-14 relative"
            >
              {item.isAvatar && user ? (
                <Avatar
                  src={user.avatarUrl}
                  alt={user.fullName}
                  size="sm"
                  className={isActive ? 'ring-2 ring-brand-primary' : ''}
                />
              ) : (
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-brand-primary stroke-[2.5]' : 'text-brand-muted stroke-[1.8]'
                  }`}
                />
              )}

              {/* Active Orange Dot Indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute bottom-1.5" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
