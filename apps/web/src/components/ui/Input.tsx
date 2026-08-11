import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold text-brand-muted tracking-wide">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-brand-muted pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={clsx(
              'w-full h-11 bg-white border border-brand-border rounded-12px text-sm text-brand-text placeholder-brand-muted/50 transition-colors focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary min-h-[44px]',
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
