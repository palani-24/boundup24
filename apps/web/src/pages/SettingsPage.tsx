import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { LogOut, Shield, Bell, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none flex flex-col gap-6">
      <h1 className="text-xl font-extrabold font-heading text-brand-text">Settings</h1>

      <div className="bg-white border border-brand-border rounded-24px p-6 shadow-soft flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-16px">
          <User className="w-5 h-5 text-brand-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-xs text-brand-text">Logged in as</span>
            <span className="text-xs text-brand-muted">@{user?.username} ({user?.email})</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-brand-border/40">
          <button className="flex items-center gap-3 p-3 rounded-12px hover:bg-black/5 text-xs font-semibold text-brand-text text-left">
            <Lock className="w-4 h-4 text-brand-muted" /> Privacy & Security
          </button>
          <button className="flex items-center gap-3 p-3 rounded-12px hover:bg-black/5 text-xs font-semibold text-brand-text text-left">
            <Bell className="w-4 h-4 text-brand-muted" /> Push Notifications
          </button>
          <button className="flex items-center gap-3 p-3 rounded-12px hover:bg-black/5 text-xs font-semibold text-brand-text text-left">
            <Shield className="w-4 h-4 text-brand-muted" /> Account Security
          </button>
        </div>

        <div className="pt-4 border-t border-brand-border">
          <Button variant="danger" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};
