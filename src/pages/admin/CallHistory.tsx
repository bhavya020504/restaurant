import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDuration } from '../../utils/formatters';
import { PhoneCall, Mic, FileText, Sparkles } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';

export const CallHistory: React.FC = () => {
  const { callLogs, recordings, transcripts, summaries } = useAdminStore();
  const [search, setSearch] = useState('');

  const [activeRecordingModal, setActiveRecordingModal] = useState<any>(null);
  const [activeTranscriptModal, setActiveTranscriptModal] = useState<any>(null);
  const [activeSummaryModal, setActiveSummaryModal] = useState<any>(null);

  const filteredLogs = callLogs.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerPhone.includes(search)
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search call customer or phone..."
          />
        </div>
        <p className="text-xs text-slate-400 font-semibold">Total Logged Inbound Calls: {callLogs.length}</p>
      </div>

      {filteredLogs.length > 0 ? (
        <Table headers={['Customer', 'Phone', 'Date & Time', 'Duration', 'Status', 'Actions']}>
          {filteredLogs.map((log) => {
            const recording = recordings.find((r) => r.callId === log.id);
            const transcript = transcripts.find((t) => t.callId === log.id);
            const summary = summaries.find((s) => s.callId === log.id);

            return (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{log.customerName}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.customerPhone}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.date} at {log.time}</td>
                <td className="px-6 py-4 text-xs font-bold font-mono">{formatDuration(log.durationSeconds)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      log.status === 'Answered'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!recording}
                      icon={<Mic className="w-3.5 h-3.5 text-orange-500" />}
                      onClick={() => setActiveRecordingModal(recording)}
                      title="Play Audio Recording"
                    >
                      Recording
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!transcript}
                      icon={<FileText className="w-3.5 h-3.5 text-blue-500" />}
                      onClick={() => setActiveTranscriptModal(transcript)}
                      title="View Transcript"
                    >
                      Transcript
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!summary}
                      icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                      onClick={() => setActiveSummaryModal(summary)}
                      title="View AI Summary"
                    >
                      Summary
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState
          title="No Call History Available"
          description="No call history available. This data will appear after backend integration."
          icon={<PhoneCall className="w-8 h-8" />}
        />
      )}

      {/* RECORDING MODAL */}
      <Modal isOpen={!!activeRecordingModal} onClose={() => setActiveRecordingModal(null)} title={`Audio Recording - ${activeRecordingModal?.customerName}`}>
        {activeRecordingModal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Duration: {activeRecordingModal.duration} • File Size: {activeRecordingModal.fileSize}</p>
            <audio controls className="w-full">
              <source src={activeRecordingModal.audioUrl} type="audio/mp3" />
            </audio>
          </div>
        )}
      </Modal>

      {/* TRANSCRIPT MODAL */}
      <Modal isOpen={!!activeTranscriptModal} onClose={() => setActiveTranscriptModal(null)} title={`Call Transcript - ${activeTranscriptModal?.customerName}`}>
        {activeTranscriptModal && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {activeTranscriptModal.dialogue.map((line: any, idx: number) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className={line.speaker === 'Customer' ? 'text-orange-500' : 'text-blue-500'}>{line.speaker}</span>
                  <span className="text-[10px] text-slate-400">{line.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{line.text}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* SUMMARY MODAL */}
      <Modal isOpen={!!activeSummaryModal} onClose={() => setActiveSummaryModal(null)} title={`Call Summary - ${activeSummaryModal?.customerName}`}>
        {activeSummaryModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
              Sentiment: {activeSummaryModal.sentiment}
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Key Dialogue Points</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                {activeSummaryModal.keyPoints.map((pt: string, idx: number) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">Follow-up Action:</span>
              <p className="text-slate-500 mt-0.5">{activeSummaryModal.actionRequired}</p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
