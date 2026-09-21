import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'emerald',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    blue: 'bg-sky-50 text-sky-700 border-sky-200/70',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/70',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/70',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx('inline-flex items-center gap-1 border', variants[variant], sizes[size], className)
      )}
      {...props}
    >
      {children}
    </span>
  );
};
