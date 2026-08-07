import React from 'react';
import { Database, Inbox, Server } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'This data will appear after backend integration.',
  icon,
  action
}) => {
  return (
    <div className="py-16 px-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto my-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto border border-orange-500/20">
        {icon || <Server className="w-8 h-8" />}
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
