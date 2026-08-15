import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square } from 'lucide-react';

export const CreateVoicePostPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Voice Post</h1>
          <div className="w-8" />
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-24px p-8 shadow-sm flex flex-col items-center text-center gap-6 my-4">
          <span className="text-2xl font-mono font-extrabold text-[#111111]">
            00:{seconds < 10 ? `0${seconds}` : seconds} / 00:30
          </span>

          <button
            onClick={handleToggleRecord}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 text-white shadow-xl animate-pulse ring-4 ring-red-200'
                : 'bg-[#FF5A1F] text-white shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            {isRecording ? <Square className="w-10 h-10 fill-white" /> : <Mic className="w-12 h-12" />}
          </button>

          <p className="text-xs text-[#666666] font-medium">
            {isRecording ? 'Recording your voice snippet...' : 'Tap to record your voice snippet (max 30s)'}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          alert('Voice Post published to feed!');
          navigate('/home');
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Share Voice Post
      </button>
    </div>
  );
};
