import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const FollowingPage: React.FC = () => {
  const { username = 'k2d' } = useParams();
  const navigate = useNavigate();

  const followingList = [
    { id: '1', username: 'designhub', fullName: 'Design Hub', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300' },
    { id: '2', username: 'ux.mentor', fullName: 'UX Mentor', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300' },
    { id: '3', username: 'ai.withme', fullName: 'AI With Me', avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col gap-4 py-4 px-3 select-none">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Following</h1>
          <span className="text-[11px] text-[#666666]">@{username} • 340 Following</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {followingList.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/profile/${user.username}`)}
            className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] rounded-20px cursor-pointer hover:border-[#FF5A1F] transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Avatar src={user.avatarUrl} alt={user.username} size="md" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-[#111111]">@{user.username}</span>
                <span className="text-[11px] text-[#666666]">{user.fullName}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const btn = e.currentTarget;
                btn.innerText = btn.innerText === 'Following' ? 'Follow' : 'Following';
              }}
              className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#FF5A1F] text-white shadow-sm"
            >
              Following
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
