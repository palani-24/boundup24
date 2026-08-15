import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 38 }) => (
  <div className={`relative rounded-xl overflow-hidden shadow-lg border border-orange-500/30 ${className}`} style={{ width: size, height: size }}>
    <img src="/boundup_logo.png" alt="BoundUp Logo" className="w-full h-full object-cover" />
  </div>
);

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = true, className = '' }) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 54,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        <LogoIcon size={iconSizes[size]} />
        <span className={`font-heading font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className="text-[#111111]">Bound</span>
          <span className="text-[#FF5A1F]">
            Up
          </span>
        </span>
      </div>
      {showTagline && (
        <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5 ml-1 flex items-center gap-1">
          <span className="w-3 h-[1.5px] bg-orange-500/80 inline-block"></span>
          Feel People Live.
          <span className="w-3 h-[1.5px] bg-orange-500/80 inline-block"></span>
        </span>
      )}
    </div>
  );
};
