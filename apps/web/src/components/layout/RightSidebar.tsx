import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle, Sparkles, ChevronDown, TrendingUp, ArrowRight, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';

export const RightSidebar: React.FC = () => {
  const { user } = useAuthStore();

  const mockUser = {
    fullName: user?.fullName || 'Karthik K',
    username: user?.username || 'k2d',
    avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    postsCount: 128,
    followersCount: '2.4K',
    followingCount: 340,
    bio: 'Designer • Developer • Dreamer Building products that matter.',
  };

  const suggestedUsers = [
    {
      id: 's1',
      username: 'designhub',
      role: 'Designer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
    },
    {
      id: 's2',
      username: 'creative.soul',
      role: 'Artist',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    },
    {
      id: 's3',
      username: 'ux.mentor',
      role: 'UX Designer',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
    },
  ];

  return (
    <aside className="w-full flex flex-col gap-4 select-none">
      {/* 1. USER MINI PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-4 shadow-sm card-shadow flex flex-col items-center text-center">
        <div className="relative mb-2">
          <Avatar src={mockUser.avatarUrl} alt={mockUser.fullName} size="xl" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#FF5A1F] border-2 border-white dark:border-slate-900 rounded-full" />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="font-extrabold text-base text-brand-text dark:text-gray-100">{mockUser.fullName}</span>
          <CheckCircle className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F]/10" />
        </div>
        <span className="text-xs text-brand-muted dark:text-slate-400 font-medium">@{mockUser.username}</span>

        {/* Stats Row */}
        <div className="grid grid-cols-3 w-full py-3 my-3 border-y border-brand-border/60 dark:border-slate-800 text-center">
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">{mockUser.postsCount}</span>
            <span className="text-[10px] font-semibold text-brand-muted dark:text-slate-400">Posts</span>
          </div>
          <div className="flex flex-col border-x border-brand-border/60 dark:border-slate-800">
            <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">{mockUser.followersCount}</span>
            <span className="text-[10px] font-semibold text-brand-muted dark:text-slate-400">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">{mockUser.followingCount}</span>
            <span className="text-[10px] font-semibold text-brand-muted dark:text-slate-400">Following</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-brand-muted dark:text-slate-400 leading-relaxed font-medium mb-2 px-1">
          {mockUser.bio}
        </p>

        {/* Creator Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#FF5A1F] rounded-full text-[11px] font-bold mb-3 border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>BoundUp Creator</span>
        </div>

        {/* Edit Profile Action */}
        <NavLink
          to={`/profile/${mockUser.username}`}
          className="w-full py-2 bg-gray-100 dark:bg-slate-800 text-brand-text dark:text-gray-200 rounded-16px text-xs font-extrabold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-center"
        >
          Edit Profile
        </NavLink>
      </div>

      {/* 2. YOUR ACTIVITY ANALYTICS WIDGET */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-4 shadow-sm card-shadow flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">Your Activity</span>
          <button className="flex items-center gap-1 text-[11px] font-bold text-brand-muted dark:text-slate-400 hover:text-brand-text">
            <span>This Week</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Activity Items with Sparklines */}
        <div className="flex flex-col gap-3">
          {/* Item 1 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-brand-muted dark:text-slate-400 font-semibold">Profile Views</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">3.2K</span>
                <span className="text-[10px] font-bold text-[#FF5A1F] bg-orange-50 px-1.5 py-0.5 rounded-full">
                  +12%
                </span>
              </div>
            </div>
            {/* SVG Sparkline */}
            <svg className="w-20 h-7 text-[#FF5A1F]" viewBox="0 0 80 28" fill="none">
              <path
                d="M2 22 L15 16 L30 20 L45 8 L60 14 L78 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[11px] text-brand-muted dark:text-slate-400 font-semibold">Post Reach</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">12.8K</span>
                <span className="text-[10px] font-bold text-[#FF5A1F] bg-orange-50 px-1.5 py-0.5 rounded-full">
                  +18%
                </span>
              </div>
            </div>
            {/* SVG Sparkline */}
            <svg className="w-20 h-7 text-[#FF5A1F]" viewBox="0 0 80 28" fill="none">
              <path
                d="M2 24 L18 18 L32 22 L48 10 L62 12 L78 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 dark:border-slate-800">
            <div className="flex flex-col">
              <span className="text-[11px] text-brand-muted dark:text-slate-400 font-semibold">Engagement</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">8.7K</span>
                <span className="text-[10px] font-bold text-[#FF5A1F] bg-orange-50 px-1.5 py-0.5 rounded-full">
                  +8%
                </span>
              </div>
            </div>
            {/* SVG Sparkline */}
            <svg className="w-20 h-7 text-brand-primary" viewBox="0 0 80 28" fill="none">
              <path
                d="M2 20 L16 14 L30 18 L46 6 L60 10 L78 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <NavLink
          to="/analytics"
          className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline mt-1 pt-2 border-t border-brand-border/40 dark:border-slate-800"
        >
          <span>View all analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* 3. SUGGESTED FOR YOU WIDGET */}
      <div className="bg-white dark:bg-slate-900 border border-brand-border dark:border-slate-800 rounded-24px p-4 shadow-sm card-shadow flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-brand-text dark:text-gray-100">Suggested for you</span>
          <NavLink to="/explore" className="text-xs font-bold text-brand-primary hover:underline">
            See all
          </NavLink>
        </div>

        <div className="flex flex-col gap-3">
          {suggestedUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar src={u.avatarUrl} alt={u.username} size="sm" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-brand-text dark:text-gray-100 hover:underline cursor-pointer">
                    {u.username}
                  </span>
                  <span className="text-[11px] text-brand-muted dark:text-slate-400 font-medium">{u.role}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  const target = e.currentTarget;
                  target.innerText = target.innerText === 'Follow' ? 'Following' : 'Follow';
                  target.classList.toggle('bg-brand-primary');
                  target.classList.toggle('text-white');
                }}
                className="px-3.5 py-1.5 border border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-full text-xs font-extrabold transition-all"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
