import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Sparkles, CheckCircle } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Summaries: React.FC = () => {
  const summaries = useAdminStore((state) => state.summaries);

  return (
    <div className="space-y-6">
      {summaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summaries.map((sum) => (
            <div key={sum.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">AI Call Summary</span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">{sum.customerName}</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  {sum.sentiment} Sentiment
                </span>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Points</h5>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {sum.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">Action Required:</span>
                <p className="text-slate-500 mt-0.5">{sum.actionRequired}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Summaries Available"
          description="No summaries available. This data will appear after backend integration."
          icon={<Sparkles className="w-8 h-8" />}
        />
      )}
    </div>
  );
};
