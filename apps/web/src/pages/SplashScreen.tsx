import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#FF5A1F] flex flex-col items-center justify-between py-12 px-6 select-none text-white animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-2xl flex items-center justify-center">
          <img src="/boundup_logo.png" alt="BoundUp" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-heading font-extrabold tracking-tight text-white mt-2">BoundUp</h1>
        <p className="text-xs font-semibold text-white/90 tracking-widest uppercase">Feel People Live.</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-bold text-white/80">Loading BoundUp Mobile...</span>
      </div>
    </div>
  );
};
