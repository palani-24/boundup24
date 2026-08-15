import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, CheckCircle } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || 'k2d';
  const navigate = useNavigate();

  const mockResults = [
    {
      id: 'u1',
      username: 'k2d',
      fullName: 'Karthik K',
      bio: 'Designer • Developer • Dreamer',
      followers: '2.4K',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      isFollowing: true,
    },
    {
      id: 'u2',
      username: 'designhub',
      fullName: 'Design Hub',
      bio: 'UI/UX Mobile Systems & Motion',
      followers: '14.2K',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      isFollowing: false,
    },
    {
      id: 'u3',
      username: 'creative.soul',
      fullName: 'Creative Soul',
      bio: 'Digital Arts & Photography',
      followers: '8.9K',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      isFollowing: false,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col gap-4 py-4 px-3 select-none">
      {/* HEADER WITH SEARCH BAR */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            defaultValue={query}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-full text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
          />
        </div>
      </div>

      <span className="text-xs font-extrabold text-[#111111] px-1">Search results for "{query}"</span>

      {/* RESULTS LIST */}
      <div className="flex flex-col gap-2">
        {mockResults.map((u) => (
          <div
            key={u.id}
            onClick={() => navigate(`/profile/${u.username}`)}
            className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] rounded-20px cursor-pointer hover:border-[#FF5A1F] transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Avatar src={u.avatarUrl} alt={u.username} size="md" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xs text-[#111111]">@{u.username}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                </div>
                <span className="text-[11px] text-[#666666] font-medium">{u.fullName} • {u.followers} followers</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const btn = e.currentTarget;
                btn.innerText = btn.innerText === 'Follow' ? 'Following' : 'Follow';
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                u.isFollowing
                  ? 'bg-white border border-[#FF5A1F] text-[#FF5A1F]'
                  : 'bg-[#FF5A1F] text-white shadow-sm'
              }`}
            >
              {u.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
