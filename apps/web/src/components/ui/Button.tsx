import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-16px transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98] min-h-[44px] min-w-[44px] px-4';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-accent shadow-soft hover:shadow-ambient',
    secondary: 'bg-brand-secondary text-brand-text hover:bg-amber-400 font-semibold',
    outline: 'border border-brand-border text-brand-text hover:bg-brand-primary/5',
    ghost: 'text-brand-text hover:bg-black/5',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'text-xs h-9 px-3 py-1.5',
    md: 'text-sm h-11 px-5 py-2.5',
    lg: 'text-base h-12 px-6 py-3',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
