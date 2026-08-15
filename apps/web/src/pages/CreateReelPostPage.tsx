import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Film, Upload, X } from 'lucide-react';

export const CreateReelPostPage: React.FC = () => {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none max-w-xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Reel Video</h1>
          <div className="w-8" />
        </div>

        {/* HIDDEN FILE INPUT FOR VIDEO */}
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* UPLOAD & PREVIEW REEL AREA */}
        {videoPreviewUrl ? (
          <div className="relative bg-black rounded-24px overflow-hidden max-h-80 shadow-md">
            <video src={videoPreviewUrl} controls className="w-full h-full object-cover max-h-80" />
            <button
              onClick={() => setVideoPreviewUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-dashed border-[#FF5A1F]/50 hover:border-[#FF5A1F] transition-all cursor-pointer rounded-24px p-8 shadow-sm flex flex-col items-center justify-center text-center gap-3 min-h-[220px]"
          >
            <div className="p-4 bg-orange-50 text-[#FF5A1F] rounded-full">
              <Film className="w-8 h-8" />
            </div>
            <span className="font-extrabold text-xs text-[#111111]">Select Reel Video from Device</span>
            <span className="text-[11px] text-[#666666]">Tap to browse gallery (MP4, MOV up to 60s)</span>
          </div>
        )}

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
          if (!videoPreviewUrl) {
            alert('Please select a video from your device!');
            return;
          }
          alert('Reel published to feed!');
          navigate('/reels');
        }}
        disabled={!videoPreviewUrl}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 disabled:opacity-50 transition-all mt-4"
      >
        Share Reel
      </button>
    </div>
  );
};
