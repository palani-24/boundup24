import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

export const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(true);
  const [comments, setComments] = useState(true);
  const [followers, setFollowers] = useState(true);
  const [messages, setMessages] = useState(true);
  const [liveRooms, setLiveRooms] = useState(true);

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Notification Settings</h1>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
          {[
            { label: 'Likes & Reactions', state: likes, setState: setLikes },
            { label: 'Comments & Replies', state: comments, setState: setComments },
            { label: 'New Followers', state: followers, setState: setFollowers },
            { label: 'Direct & Group Messages', state: messages, setState: setMessages },
            { label: 'Live Audio Rooms', state: liveRooms, setState: setLiveRooms },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] last:border-0">
              <span className="font-extrabold text-xs text-[#111111]">{item.label}</span>
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => item.setState(e.target.checked)}
                className="w-5 h-5 accent-[#FF5A1F] rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          alert('Notification preferences updated!');
          navigate(-1);
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Save Notification Preferences
      </button>
    </div>
  );
};
