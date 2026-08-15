import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, MessageSquare, Shield, Users } from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowMessages, setAllowMessages] = useState('everyone');
  const [allowComments, setAllowComments] = useState('followers');

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Privacy Settings</h1>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-5">
          {/* PRIVATE ACCOUNT TOGGLE */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-[#111111]">Private Account</span>
              <span className="text-[11px] text-[#666666]">Only approved followers can view your posts and reels</span>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5 accent-[#FF5A1F] rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#111111]">Who can message you</label>
              <select
                value={allowMessages}
                onChange={(e) => setAllowMessages(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers You Follow Back</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#111111]">Who can comment on your posts</label>
              <select
                value={allowComments}
                onChange={(e) => setAllowComments(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers Only</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          alert('Privacy settings saved!');
          navigate(-1);
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Save Privacy Preferences
      </button>
    </div>
  );
};
