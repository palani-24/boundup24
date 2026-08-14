import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { LogOut, Shield, Bell, Lock, User, Palette, Download, KeyRound, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'midnight'>('dark');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isPrivateAccount, setIsPrivateAccount] = useState(user?.isPrivate || false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none flex flex-col gap-6">
      <h1 className="text-xl font-extrabold font-heading text-brand-text">Settings & Preferences</h1>

      <div className="bg-white border border-brand-border rounded-24px p-6 shadow-soft flex flex-col gap-5">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-16px">
          <User className="w-5 h-5 text-brand-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-xs text-brand-text">Logged in as</span>
            <span className="text-xs text-brand-muted">@{user?.username} ({user?.email})</span>
          </div>
        </div>

        {/* THEME SELECTOR SECTION */}
        <div className="flex flex-col gap-2 pt-2 border-t border-brand-border/40">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-text">
            <Palette className="w-4 h-4 text-brand-primary" /> Theme Accent & Mode
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[
              { id: 'dark', label: 'Dark Mode', color: 'bg-slate-900 text-white' },
              { id: 'light', label: 'Light Mode', color: 'bg-gray-100 text-gray-800' },
              { id: 'midnight', label: 'Midnight Blue', color: 'bg-blue-950 text-blue-200' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id as any)}
                className={`p-3 rounded-16px text-xs font-bold flex items-center justify-between border transition-all ${
                  t.color
                } ${
                  selectedTheme === t.id ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-transparent opacity-80'
                }`}
              >
                <span>{t.label}</span>
                {selectedTheme === t.id && <Check className="w-3.5 h-3.5 text-brand-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* SECURITY & PRIVACY CONTROLS */}
        <div className="flex flex-col gap-3 pt-3 border-t border-brand-border/40">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-brand-muted" />
              <div>
                <p className="text-xs font-bold text-brand-text">Private Account</p>
                <p className="text-[10px] text-brand-muted">Only approved followers can view your content</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPrivateAccount}
              onChange={(e) => setIsPrivateAccount(e.target.checked)}
              className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-brand-muted" />
              <div>
                <p className="text-xs font-bold text-brand-text">Two-Factor Authentication (2FA)</p>
                <p className="text-[10px] text-brand-muted">Secure your account using an authenticator app</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={is2FAEnabled}
              onChange={(e) => setIs2FAEnabled(e.target.checked)}
              className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
            />
          </div>
        </div>

        {/* DATA EXPORT & LOGOUT */}
        <div className="pt-4 border-t border-brand-border flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => alert('Preparing ZIP archive of your posts, media, and profile data...')}
          >
            <Download className="w-4 h-4 mr-2" /> Export Account Data (ZIP)
          </Button>

          <Button variant="danger" className="w-full justify-center" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};
