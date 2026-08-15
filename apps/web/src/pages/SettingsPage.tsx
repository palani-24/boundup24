import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar';
import {
  User,
  Lock,
  Bell,
  Palette,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const settingsMenuItems = [
    { label: 'Account', icon: User, path: '/settings/account' },
    { label: 'Privacy', icon: Lock, path: '/settings/privacy' },
    { label: 'Notifications', icon: Bell, path: '/settings/notifications' },
    { label: 'Appearance', icon: Palette, path: '/settings/appearance', badge: 'Beta' },
    { label: 'Help & Support', icon: HelpCircle, path: '/settings/help' },
    { label: 'About BoundUp', icon: Info, path: '/settings/about' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none flex flex-col gap-5">
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-brand-text dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold font-heading text-brand-text dark:text-gray-100">Settings</h1>
      </div>

      {/* USER PROFILE HEADER CARD (IMAGE 1) */}
      <NavLink
        to={`/profile/${user?.username || 'k2d'}`}
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px shadow-sm card-shadow hover:border-brand-primary transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <Avatar
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
            alt={user?.fullName || 'Karthik K'}
            size="lg"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-brand-text dark:text-gray-100 group-hover:text-brand-primary transition-colors">
              {user?.fullName || 'Karthik K'}
            </span>
            <span className="text-xs text-brand-muted dark:text-slate-400 font-medium">@{user?.username || 'k2d'}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary transition-colors" />
      </NavLink>

      {/* SETTINGS MENU LIST (IMAGE 1) */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-2 shadow-sm card-shadow flex flex-col gap-1">
        {settingsMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              onClick={() => alert(`Navigating to ${item.label}...`)}
              className="flex items-center justify-between p-3.5 rounded-20px hover:bg-gray-50 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <Icon className="w-5 h-5 text-brand-text dark:text-gray-200 group-hover:text-brand-primary transition-colors stroke-[2]" />
                <span className="font-extrabold text-xs text-brand-text dark:text-gray-100 group-hover:text-brand-primary transition-colors">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white text-[10px] font-black rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-brand-muted dark:text-slate-500 group-hover:text-brand-primary transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* BIG ORANGE LOG OUT BUTTON (IMAGE 1) */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white rounded-24px text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition-all mt-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>

      {/* FOOTER TEXT */}
      <div className="flex flex-col items-center justify-center gap-1 py-3 text-center">
        <span className="text-[11px] font-semibold text-brand-muted dark:text-slate-500">BoundUp v2.0.1</span>
        <span className="text-[11px] font-semibold text-brand-muted dark:text-slate-500">
          Made with ❤️ for creators
        </span>
      </div>
    </div>
  );
};
