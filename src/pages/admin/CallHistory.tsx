import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { ApiService } from '../../services/api';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDuration } from '../../utils/formatters';
import { PhoneCall, Mic, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';

export const CallHistory: React.FC = () => {
  const { callLogs: storeLogs } = useAdminStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [activeRecordingModal, setActiveRecordingModal] = useState<any>(null);
  const [activeTranscriptModal, setActiveTranscriptModal] = useState<any>(null);
  const [activeSummaryModal, setActiveSummaryModal] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCallLogs();
      if (Array.isArray(data) && data.length > 0) {
        setLogs(data);
      } else {
        setLogs(storeLogs || []);
      }
    } catch (e) {
      console.warn('Could not load live call logs, using store logs:', e);
      setLogs(storeLogs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (c) =>
      (c.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.customerPhone || '').includes(search)
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
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={fetchLogs}
          >
            Refresh Calls
          </Button>
          <p className="text-xs text-slate-400 font-semibold">Total Logged Calls: {logs.length}</p>
        </div>
      </div>

      {filteredLogs.length > 0 ? (
        <Table headers={['Customer', 'Phone', 'Date & Time', 'Duration', 'Status', 'Actions']}>
          {filteredLogs.map((log) => {
            return (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{log.customerName || 'Customer'}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.customerPhone || '—'}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.date} {log.time ? `at ${log.time}` : ''}</td>
                <td className="px-6 py-4 text-xs font-bold font-mono">{formatDuration(log.durationSeconds || 0)}</td>
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
                      disabled={!log.recordingUrl}
                      icon={<Mic className="w-3.5 h-3.5 text-orange-500" />}
                      onClick={() => setActiveRecordingModal(log)}
                      title="Play Audio Recording"
                    >
                      Recording
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!log.transcript}
                      icon={<FileText className="w-3.5 h-3.5 text-blue-500" />}
                      onClick={() => setActiveTranscriptModal(log)}
                      title="View Transcript"
                    >
                      Transcript
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!log.summary}
                      icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                      onClick={() => setActiveSummaryModal(log)}
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
          title={loading ? "Loading Call History..." : "No Call History Available"}
          description={loading ? "Fetching real-time call logs from SnapServe..." : "No call history available yet."}
          icon={<PhoneCall className="w-8 h-8" />}
        />
      )}

      {/* RECORDING MODAL */}
      <Modal isOpen={!!activeRecordingModal} onClose={() => setActiveRecordingModal(null)} title={`Audio Recording - ${activeRecordingModal?.customerName || 'Call'}`}>
        {activeRecordingModal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Duration: {formatDuration(activeRecordingModal.durationSeconds || 0)} • SnapServe Call #{activeRecordingModal.id}</p>
            {activeRecordingModal.recordingUrl ? (
              <audio controls autoPlay className="w-full">
                <source src={activeRecordingModal.recordingUrl} type="audio/mp3" />
                Your browser does not support audio playback.
              </audio>
            ) : (
              <p className="text-xs text-slate-500">No recording URL available for this call.</p>
            )}
          </div>
        )}
      </Modal>

      {/* TRANSCRIPT MODAL */}
      <Modal isOpen={!!activeTranscriptModal} onClose={() => setActiveTranscriptModal(null)} title={`Call Transcript - ${activeTranscriptModal?.customerName || 'Call'}`}>
        {activeTranscriptModal && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <p className="text-xs text-slate-400 font-semibold mb-2">SnapServe Call ID: #{activeTranscriptModal.id}</p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {activeTranscriptModal.transcript || 'No transcript text available.'}
            </div>
          </div>
        )}
      </Modal>

      {/* SUMMARY MODAL */}
      <Modal isOpen={!!activeSummaryModal} onClose={() => setActiveSummaryModal(null)} title={`AI Call Summary - ${activeSummaryModal?.customerName || 'Call'}`}>
        {activeSummaryModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
              Call Status: {activeSummaryModal.status} ({formatDuration(activeSummaryModal.durationSeconds || 0)})
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Executive Summary</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {activeSummaryModal.summary || 'No AI summary generated for this call.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
