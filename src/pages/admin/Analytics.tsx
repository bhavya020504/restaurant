import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
        <EmptyState
          title="No Analytics Data Available"
          description="Analytics will appear after backend integration."
          icon={<BarChart3 className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};
