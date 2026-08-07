import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl';
  
  const variants = {
    text: 'h-4 w-full rounded-md',
    rectangular: 'w-full h-32 rounded-2xl',
    circular: 'rounded-full w-12 h-12'
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      style={style}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
    <div className="flex items-center justify-between">
      <Skeleton width="40%" height="16px" />
      <Skeleton variant="circular" width="36px" height="36px" />
    </div>
    <Skeleton width="60%" height="28px" />
    <Skeleton width="80%" height="14px" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60">
        <Skeleton width="20%" height="16px" />
        <Skeleton width="25%" height="16px" />
        <Skeleton width="15%" height="16px" />
        <Skeleton width="15%" height="24px" />
      </div>
    ))}
  </div>
);
