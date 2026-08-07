import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Mic, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export const Recordings: React.FC = () => {
  const recordings = useAdminStore((state) => state.recordings);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-4">
          Audio Recording Vault ({recordings.length})
        </h3>

        {recordings.length > 0 ? (
          <div className="space-y-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-heading">{rec.customerName}</h4>
                    <p className="text-xs text-slate-400">{rec.date} • Duration {rec.duration} • {rec.fileSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <audio controls className="w-full sm:w-64 h-8">
                    <source src={rec.audioUrl} type="audio/mp3" />
                  </audio>
                  <a href={rec.audioUrl} download target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" icon={<Download className="w-4 h-4" />}>
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Recordings Available"
            description="No recordings available. This data will appear after backend integration."
            icon={<Mic className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
