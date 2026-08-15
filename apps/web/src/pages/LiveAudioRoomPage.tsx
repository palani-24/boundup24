import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Mic, MicOff, Share2, Hand, LogOut, CheckCircle } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const LiveAudioRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);

  const roomInfo = {
    title: 'Creators Audio Room',
    topic: 'Discussing Cinematic Design & Mobile Experiences',
    host: { username: 'k2d', name: 'Karthik K', role: 'Host', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
    coHost: { username: 'designhub', name: 'Design Hub', role: 'Co-host', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300' },
    speaker: { username: 'creative.soul', name: 'Creative Soul', role: 'Speaker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
    listeners: [
      { username: 'ux.mentor', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300' },
      { username: 'travel.diary', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300' },
      { username: 'ai.withme', avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300' },
      { username: 'tech.buddy', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300' },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between p-4 select-none">
      <div className="flex flex-col gap-6">
        {/* TOP HEADER */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#FF5A1F] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE
            </span>
            <h1 className="font-extrabold text-sm text-[#111111] font-heading">{roomInfo.title}</h1>
          </div>
          <button
            onClick={() => {
              alert('Stage link copied!');
            }}
            className="p-2 text-[#666666] hover:text-[#FF5A1F] rounded-full hover:bg-gray-100"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* TOPIC CARD */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#FF5A1F] uppercase tracking-wider">Current Discussion</span>
          <h2 className="text-base font-extrabold text-[#111111] leading-snug">{roomInfo.topic}</h2>
        </div>

        {/* STAGE SPEAKERS SECTION */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-4">
          <span className="text-xs font-extrabold text-[#111111]">Stage Speakers</span>

          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Host */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative p-1 rounded-full border-2 border-[#FF5A1F]">
                <Avatar src={roomInfo.host.avatarUrl} alt={roomInfo.host.username} size="lg" />
                <span className="absolute bottom-0 right-0 p-1 bg-[#FF5A1F] text-white rounded-full">
                  <Mic className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xs text-[#111111]">@{roomInfo.host.username}</span>
                <CheckCircle className="w-3 h-3 text-[#FF5A1F]" />
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5A1F]">
                {roomInfo.host.role}
              </span>
            </div>

            {/* Co-Host */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative p-1 rounded-full border-2 border-[#FF5A1F]">
                <Avatar src={roomInfo.coHost.avatarUrl} alt={roomInfo.coHost.username} size="lg" />
                <span className="absolute bottom-0 right-0 p-1 bg-[#FF5A1F] text-white rounded-full">
                  <Mic className="w-3 h-3" />
                </span>
              </div>
              <span className="font-extrabold text-xs text-[#111111]">@{roomInfo.coHost.username}</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5A1F]">
                {roomInfo.coHost.role}
              </span>
            </div>

            {/* Speaker */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative p-1 rounded-full border border-[#E5E7EB]">
                <Avatar src={roomInfo.speaker.avatarUrl} alt={roomInfo.speaker.username} size="lg" />
              </div>
              <span className="font-extrabold text-xs text-[#111111]">@{roomInfo.speaker.username}</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-[#666666]">
                {roomInfo.speaker.role}
              </span>
            </div>
          </div>
        </div>

        {/* LISTENERS SECTION */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-3">
          <span className="text-xs font-extrabold text-[#111111]">Listeners ({roomInfo.listeners.length + 124})</span>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {roomInfo.listeners.map((l) => (
              <div key={l.username} className="flex flex-col items-center gap-1 flex-shrink-0">
                <Avatar src={l.avatarUrl} alt={l.username} size="md" />
                <span className="text-[10px] font-semibold text-[#666666]">@{l.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR (RULE #27) */}
      <div className="bg-white border border-[#E5E7EB] rounded-24px p-3 shadow-lg flex items-center justify-around mt-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full transition-colors ${
            isMuted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-[#111111] hover:bg-gray-200'
          }`}
          title="Toggle Mic"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={() => {
            setHasRaisedHand(!hasRaisedHand);
            alert(hasRaisedHand ? 'Hand lowered' : 'Hand raised to speak!');
          }}
          className={`p-3 rounded-full transition-colors ${
            hasRaisedHand ? 'bg-orange-50 text-[#FF5A1F] border border-[#FF5A1F]' : 'bg-gray-100 text-[#111111] hover:bg-gray-200'
          }`}
          title="Raise Hand"
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            alert('Left Live Audio Room');
            navigate('/home');
          }}
          className="px-6 py-3 bg-[#FF5A1F] text-white rounded-full text-xs font-extrabold flex items-center gap-2 shadow-md hover:opacity-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Leave Room</span>
        </button>
      </div>
    </div>
  );
};
