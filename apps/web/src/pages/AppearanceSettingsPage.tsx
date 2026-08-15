import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

export const AppearanceSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('light');

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">Appearance Settings</h1>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-24px p-5 shadow-sm flex flex-col gap-3">
          <span className="text-xs font-extrabold text-[#111111]">Theme Option</span>
          <p className="text-[11px] text-[#666666]">
            BoundUp uses a dedicated <span className="font-bold text-[#FF5A1F]">BoundUp Orange & White</span> visual identity.
          </p>

          {[
            { id: 'light', label: 'BoundUp Light (Orange & White)' },
            { id: 'system', label: 'System Default' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMode(item.id)}
              className={`p-3.5 rounded-16px text-xs font-extrabold flex items-center justify-between border transition-all ${
                selectedMode === item.id
                  ? 'border-[#FF5A1F] bg-orange-50 text-[#FF5A1F]'
                  : 'border-[#E5E7EB] bg-[#F7F7F7] text-[#111111]'
              }`}
            >
              <span>{item.label}</span>
              {selectedMode === item.id && <Check className="w-4 h-4 text-[#FF5A1F] stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          alert('Appearance saved!');
          navigate(-1);
        }}
        className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-16px text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
      >
        Apply Appearance
      </button>
    </div>
  );
};
