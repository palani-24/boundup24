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
  Bookmark,
  Archive,
  BarChart3,
  Radio,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

interface NavbarProps {
  onCreateClick?: () => void;
  onGoLiveClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateClick, onGoLiveClick }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const desktopNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/messages', icon: MessageSquare, badge: 8 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
    { label: 'Create', path: '#create', icon: PlusSquare, onClick: onCreateClick },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { label: 'Saved', path: '/saved', icon: Archive },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const mobileNavItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Create', path: '#create', icon: Plus, isCreateBtn: true, onClick: onCreateClick },
    { label: 'Messages', path: '/messages', icon: MessageSquare, badge: 3 },
    { label: 'Profile', path: user ? `/profile/${user.username}` : '/login', icon: User, isAvatar: true },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-brand-border/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 z-40 px-4 py-5 justify-between select-none overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-5">
          {/* Logo Branding */}
          <NavLink to="/home" className="px-2 py-1">
            <Logo size="md" showTagline={false} />
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-16px text-brand-text dark:text-gray-200 hover:bg-brand-primary/10 hover:text-brand-primary transition-all text-sm font-bold min-h-[42px] group"
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="w-5 h-5 stroke-[2] text-brand-text dark:text-gray-200 group-hover:text-brand-primary transition-colors" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-16px transition-all text-sm font-bold min-h-[42px] ${
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary'
                        : 'text-brand-text dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-brand-primary'
                    }`
                  }
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 stroke-[2]" />
                    <span>{item.label}</span>
                  </div>

                  {/* Red Pill Notification Badge */}
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-extrabold rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION OF SIDEBAR */}
        <div className="flex flex-col gap-3 pt-4 border-t border-brand-border/60 dark:border-slate-800">
          {/* User Card */}
          {user && (
            <div className="flex items-center justify-between p-2 rounded-16px hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <NavLink to={`/profile/${user.username}`} className="flex items-center gap-3 truncate">
                <Avatar src={user.avatarUrl} alt={user.fullName} size="md" />
                <div className="flex flex-col truncate">
                  <span className="text-xs font-extrabold text-brand-text dark:text-gray-100 truncate">
                    {user.fullName || 'Karthik K'}
                  </span>
                  <span className="text-[11px] text-brand-muted dark:text-slate-400 truncate">@{user.username}</span>
                </div>
              </NavLink>
              <button className="p-1.5 text-brand-muted hover:text-brand-text rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* BRIGHT ORANGE GO LIVE BUTTON */}
          <button
            onClick={onGoLiveClick}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white rounded-16px text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>((o)) Go Live</span>
          </button>

          {/* Footer Copyright */}
          <div className="text-[10px] text-brand-muted dark:text-slate-500 flex flex-col gap-1 px-1">
            <span>© BoundUp 2025</span>
            <div className="flex gap-2">
              <span className="hover:underline cursor-pointer">About</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Help</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (IMAGE 1) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] glass-nav z-40 flex items-center justify-around px-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isCreateBtn) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center h-full active:scale-95 transition-transform"
                aria-label="Create Post"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6 stroke-[3]" />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full w-14 relative active:scale-95 transition-transform ${
                isActive ? 'text-brand-primary font-black' : 'text-slate-500 dark:text-slate-400 font-medium'
              }`}
            >
              {item.isAvatar && user ? (
                <Avatar
                  src={user.avatarUrl}
                  alt={user.fullName}
                  size="sm"
                  className={isActive ? 'ring-2 ring-brand-primary shadow-sm' : ''}
                />
              ) : (
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-brand-primary stroke-[2.5]' : 'text-slate-600 dark:text-slate-400 stroke-[1.8]'
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-brand-primary font-extrabold' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
