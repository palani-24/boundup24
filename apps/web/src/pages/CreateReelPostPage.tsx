import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Film, Upload } from 'lucide-react';

export const CreateReelPostPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Reel Video</h1>
          <div className="w-8" />
        </div>

        {/* UPLOAD REEL AREA */}
        <div className="bg-white border-2 border-dashed border-[#FF5A1F]/40 rounded-24px p-8 shadow-sm flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
          <div className="p-4 bg-orange-50 text-[#FF5A1F] rounded-full">
            <Film className="w-8 h-8" />
          </div>
          <span className="font-extrabold text-xs text-[#111111]">Tap to upload reel</span>
          <span className="text-[11px] text-[#666666]">MP4, MOV up to 60 seconds</span>
          <input
            type="text"
            placeholder="Or enter Reel Video URL (https://...)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full mt-2 py-2 px-3 bg-[#F7F7F7] border border-[#E5E7EB] rounded-16px text-xs text-[#111111] focus:outline-none focus:border-[#FF5A1F]"
          />
        </div>

        {/* CAPTION */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-4 shadow-sm">
          <textarea
            placeholder="Write a reel caption... #reels #BoundUp"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full text-xs text-[#111111] bg-transparent focus:outline-none resize-none placeholder:text-[#666666]"
          />
        </div>
      </div>

      <button
        onClick={() => {
          alert('Reel published to feed!');
          navigate('/reels');
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Share Reel
      </button>
    </div>
  );
};
