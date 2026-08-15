import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Image, Film } from 'lucide-react';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'voice' | 'photo' | 'reel'>('photo');

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-4 px-3 select-none">
      <div className="flex flex-col gap-5">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Create Post</h1>
          <div className="w-8" />
        </div>

        {/* THREE CREATE FORMAT TABS */}
        <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-20px p-1.5 shadow-sm">
          {[
            { id: 'voice', label: 'Voice', icon: Mic, path: '/create/voice' },
            { id: 'photo', label: 'Photo', icon: Image, path: '/create/photo' },
            { id: 'reel', label: 'Reel', icon: Film, path: '/create/reel' },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id as any);
                  navigate(t.path);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-16px text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-[#FF5A1F] text-white shadow-md'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
