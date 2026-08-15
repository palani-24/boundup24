import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Shield, FileText, Code } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const AboutBoundUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] flex flex-col justify-between py-6 px-4 select-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-3">
          <button onClick={() => navigate(-1)} className="p-2 text-[#111111] hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold font-heading text-[#111111]">About BoundUp</h1>
        </div>

        {/* LOGO HERO */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-6 shadow-sm flex flex-col items-center text-center gap-2">
          <Logo size="lg" showTagline={false} />
          <p className="text-xs font-bold text-[#FF5A1F] mt-1">Made for creators.</p>
          <span className="text-[11px] font-extrabold text-[#666666]">BoundUp v2.0.1</span>
        </div>

        {/* LINKS LIST */}
        <div className="bg-white border border-[#E5E7EB] rounded-24px p-2 shadow-sm flex flex-col gap-1">
          {[
            { label: 'Official Website', icon: Globe, link: 'https://boundup.app' },
            { label: 'Terms of Service', icon: FileText, link: '/terms' },
            { label: 'Privacy Policy', icon: Shield, link: '/privacy' },
            { label: 'Open Source Licenses', icon: Code, link: '/licenses' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => alert(`Opening ${item.label}...`)}
                className="flex items-center justify-between p-3.5 rounded-16px hover:bg-[#F7F7F7] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#FF5A1F]" />
                  <span className="font-extrabold text-xs text-[#111111]">{item.label}</span>
                </div>
                <span className="text-xs text-[#666666]">›</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center py-2 text-[10px] text-[#666666]">
        © 2026 BoundUp Inc. All rights reserved.
      </div>
    </div>
  );
};
