import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Heart, Send } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';

export const StoryViewerPage: React.FC = () => {
  const { id = '1' } = useParams();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const storyData = {
    username: 'k2d',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    timestamp: '2h ago',
    caption: 'Sunsets hit different when you’re chasing dreams 🌅',
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col justify-between p-4 relative select-none">
      {/* TOP PROGRESS BARS & USER HEADER */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-2">
        <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-[#FF5A1F] w-full animate-pulse" />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Avatar src={storyData.avatarUrl} size="sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xs text-white">@{storyData.username}</span>
              <span className="text-[10px] text-gray-300">{storyData.timestamp}</span>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="p-1.5 bg-black/40 rounded-full hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* CENTER MEDIA */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <img src={storyData.mediaUrl} alt="Story" className="w-full h-full object-cover" />
        {storyData.caption && (
          <div className="absolute bottom-20 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-16px text-center border border-white/10 z-20">
            <p className="text-xs font-bold text-white leading-relaxed">{storyData.caption}</p>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS (RULE #15) */}
      <div className="relative z-30 mt-auto flex items-center gap-2 pt-4">
        <input
          type="text"
          placeholder="Send reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1 py-2.5 px-4 bg-black/60 border border-white/30 rounded-full text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF5A1F] backdrop-blur-md"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="p-2.5 bg-black/60 border border-white/30 rounded-full text-white backdrop-blur-md hover:scale-105"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-[#FF5A1F] fill-[#FF5A1F]' : 'text-white'}`} />
        </button>
        <button
          onClick={() => {
            alert('Reply sent!');
            setReplyText('');
          }}
          className="p-2.5 bg-[#FF5A1F] text-white rounded-full shadow-md hover:opacity-90"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
