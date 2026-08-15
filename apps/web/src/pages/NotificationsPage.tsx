import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Bell, Check } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { apiFetch } from '../services/api';

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  const mockNotifications = [
    {
      id: 'n1',
      sender: {
        username: 'designhub',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      },
      type: 'LIKE',
      text: 'liked your post',
      time: '2m',
      mediaThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
    },
    {
      id: 'n2',
      sender: {
        username: 'creative.soul',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      },
      type: 'COMMENT',
      text: 'commented: "Amazing! 🔥"',
      time: '4m',
      mediaThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
    },
    {
      id: 'n3',
      sender: {
        username: 'ux.mentor',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
      },
      type: 'FOLLOW',
      text: 'started following you',
      time: '1h',
      hasFollowBack: true,
    },
    {
      id: 'n4',
      sender: {
        username: 'travel.diary',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
      },
      type: 'LIKE',
      text: 'liked your reel',
      time: '3h',
      mediaThumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300',
    },
    {
      id: 'n5',
      sender: {
        username: 'k2d',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      },
      type: 'COMMENT',
      text: 'mentioned you in a comment',
      time: '5h',
      mediaThumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-3 select-none flex flex-col gap-4">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold font-heading text-brand-text dark:text-gray-100">Notifications</h1>
        <Bell className="w-5 h-5 text-brand-primary" />
      </div>

      {/* FILTER PILLS (ALL, LIKES, COMMENTS, FOLLOWS - IMAGE 1) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'likes', label: 'Likes' },
          { id: 'comments', label: 'Comments' },
          { id: 'follows', label: 'Follows' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 text-brand-muted dark:text-slate-400 hover:text-brand-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="flex flex-col gap-2">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-20px shadow-sm card-shadow transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar src={n.sender.avatarUrl} alt={n.sender.username} size="md" />
              <div className="flex flex-col text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <NavLink to={`/profile/${n.sender.username}`} className="font-extrabold text-brand-text dark:text-gray-100 hover:underline">
                    {n.sender.username}
                  </NavLink>
                  <span className="text-brand-muted dark:text-slate-400 font-medium">{n.text}</span>
                </div>
                <span className="text-[10px] text-brand-muted dark:text-slate-500 font-medium mt-0.5">{n.time}</span>
              </div>
            </div>

            {/* ACTION / THUMBNAIL */}
            {n.hasFollowBack ? (
              <button
                onClick={(e) => {
                  const target = e.currentTarget;
                  target.innerText = target.innerText === 'Follow Back' ? 'Following' : 'Follow Back';
                  target.classList.toggle('bg-blue-600');
                  target.classList.toggle('bg-gray-200');
                }}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs font-extrabold shadow-sm transition-all"
              >
                Follow Back
              </button>
            ) : n.mediaThumbnail ? (
              <img src={n.mediaThumbnail} alt="Media preview" className="w-10 h-10 object-cover rounded-12px border border-brand-border dark:border-slate-800" />
            ) : null}
          </div>
        ))}
      </div>

      {/* BOTTOM MARK ALL AS READ BUTTON (IMAGE 1) */}
      <button
        onClick={() => alert('All notifications marked as read!')}
        className="w-full py-3 mt-3 bg-orange-500/10 hover:bg-orange-500/20 text-brand-primary border border-orange-500/20 rounded-20px text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
      >
        <Check className="w-4 h-4" />
        <span>Mark all as read</span>
      </button>
    </div>
  );
};
