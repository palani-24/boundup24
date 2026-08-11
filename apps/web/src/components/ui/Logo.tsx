import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="boundupGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC107" />
        <stop offset="50%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#B02F00" />
      </linearGradient>
      <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Dynamic B with Upward Arrow Swoosh */}
    <g filter="url(#orangeGlow)">
      {/* Back B stem & bottom loop */}
      <path
        d="M20 18 L55 18 C70 18, 78 28, 68 42 C60 52, 75 62, 72 78 C68 90, 48 90, 20 90 Z"
        fill="url(#boundupGlow)"
      />
      {/* Cutout sharp inner highlights */}
      <path
        d="M32 30 L48 30 C56 30, 58 36, 48 44 L32 44 Z"
        fill="#1C1B1B"
      />
      <path
        d="M32 54 L52 54 C62 54, 62 76, 42 76 L32 76 Z"
        fill="#1C1B1B"
      />
      {/* Upward Arrow Swoosh integrated into B */}
      <path
        d="M52 42 Q78 30, 88 12 L72 16 L88 12 L84 28"
        stroke="url(#boundupGlow)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polygon points="88,12 72,16 84,28" fill="url(#boundupGlow)" />
    </g>
  </svg>
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
          <span className="text-slate-800">Bound</span>
          <span className="text-brand-primary bg-gradient-to-r from-[#FF5722] to-[#FFC107] bg-clip-text text-transparent">
            Up
          </span>
        </span>
      </div>
      {showTagline && (
        <span className="text-[10px] font-semibold text-brand-muted tracking-widest uppercase mt-0.5 ml-1 flex items-center gap-1">
          <span className="w-3 h-[1.5px] bg-brand-primary/60 inline-block"></span>
          Feel People Live.
          <span className="w-3 h-[1.5px] bg-brand-primary/60 inline-block"></span>
        </span>
      )}
    </div>
  );
};
