import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  hasViewedStory?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  hasStory = false,
  hasViewedStory = false,
  className,
  onClick,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const ringSizes = {
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3px]',
    xl: 'p-[4px]',
  };

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'BU';

  const avatarContent = src ? (
    <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
  ) : (
    <div className="w-full h-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center rounded-full select-none">
      {initials}
    </div>
  );

  if (hasStory) {
    return (
      <div
        onClick={onClick}
        className={clsx(
          'rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer',
          ringSizes[size],
          hasViewedStory ? 'bg-gray-300' : 'story-ring-active',
          className
        )}
      >
        <div className={clsx('rounded-full bg-white p-[2px]', sizes[size])}>{avatarContent}</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx('rounded-full overflow-hidden flex-shrink-0', sizes[size], onClick && 'cursor-pointer', className)}
    >
      {avatarContent}
    </div>
  );
};
