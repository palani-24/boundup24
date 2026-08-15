import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, AlertCircle, Mail, Shield, FileText } from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();

  const helpItems = [
    { title: 'Help Center', icon: HelpCircle },
    { title: 'Report a Problem', icon: AlertCircle },
    { title: 'Contact Support', icon: Mail },
    { title: 'Community Guidelines', icon: Shield },
    { title: 'Terms & Policies', icon: FileText },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col gap-6 py-6 px-4 select-none">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
        <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold font-heading text-[#111111]">Help & Support</h1>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-24px p-2 shadow-sm flex flex-col gap-1">
        {helpItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={() => alert(`Opening ${item.title}...`)}
              className="flex items-center justify-between p-3.5 rounded-16px hover:bg-[#F7F7F7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#FF5A1F]" />
                <span className="font-extrabold text-xs text-[#111111]">{item.title}</span>
              </div>
              <span className="text-xs text-[#666666]">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
