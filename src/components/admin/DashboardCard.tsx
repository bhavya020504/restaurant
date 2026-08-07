import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtext?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtext = 'vs. yesterday'
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/20">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
          {value}
        </h3>

        {change && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {subtext}
      </p>
    </div>
  );
};
