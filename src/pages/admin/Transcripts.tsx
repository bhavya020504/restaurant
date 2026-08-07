import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { FileText } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Transcripts: React.FC = () => {
  const transcripts = useAdminStore((state) => state.transcripts);
  const [search, setSearch] = useState('');
  const [selectedTranscript, setSelectedTranscript] = useState(transcripts[0] || null);

  const filtered = transcripts.filter((t) =>
    t.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {transcripts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search transcripts..." />
            <div className="space-y-2">
              {filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTranscript(t)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    selectedTranscript?.id === t.id
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <h4 className="font-bold text-sm font-heading">{t.customerName}</h4>
                  <p className={`text-xs mt-1 ${selectedTranscript?.id === t.id ? 'text-white/80' : 'text-slate-400'}`}>
                    {t.date} • {t.dialogue.length} Exchanges
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {selectedTranscript ? (
              <div>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Transcript Log: {selectedTranscript.customerName}
                  </h3>
                  <p className="text-xs text-slate-400">Timestamp: {selectedTranscript.date}</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {selectedTranscript.dialogue.map((line, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={line.speaker === 'Customer' ? 'text-orange-500' : 'text-blue-500'}>
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-slate-400">{line.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-20">Select a transcript to view conversation log</p>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Transcripts Available"
          description="No transcripts available. This data will appear after backend integration."
          icon={<FileText className="w-8 h-8" />}
        />
      )}
    </div>
  );
};
