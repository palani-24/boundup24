import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Upload, X } from 'lucide-react';

export const CreatePhotoPostPage: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
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
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Photo Post</h1>
          <div className="w-8" />
        </div>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* UPLOAD & PREVIEW AREA */}
        {previewUrl ? (
          <div className="relative bg-black rounded-24px overflow-hidden max-h-80 shadow-md">
            <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover max-h-80" />
            <button
              onClick={() => setPreviewUrl(null)}
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
              <Upload className="w-8 h-8" />
            </div>
            <span className="font-extrabold text-xs text-[#111111]">Select Photo from Device</span>
            <span className="text-[11px] text-[#666666]">Tap to browse gallery or drag & drop</span>
          </div>
        )}

        {/* CAPTION */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-4 shadow-sm">
          <textarea
            placeholder="Write a caption... #sunset #BoundUp"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full text-xs text-[#111111] bg-transparent focus:outline-none resize-none placeholder:text-[#666666]"
          />
        </div>
      </div>

      <button
        onClick={() => {
          if (!previewUrl) {
            alert('Please select a photo from your device gallery!');
            return;
          }
          alert('Photo Post published to feed!');
          navigate('/home');
        }}
        disabled={!previewUrl}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 disabled:opacity-50 transition-all mt-4"
      >
        Share Photo Post
      </button>
    </div>
  );
};
