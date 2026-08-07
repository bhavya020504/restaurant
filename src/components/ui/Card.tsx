import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border p-6 transition-all duration-300',
          glass
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm',
          hoverable && 'hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 hover:border-orange-500/30 dark:hover:border-orange-500/40',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
