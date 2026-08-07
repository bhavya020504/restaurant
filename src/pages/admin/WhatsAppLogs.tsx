import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Table } from '../../components/ui/Table';
import { MessageCircle } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const WhatsAppLogs: React.FC = () => {
  const whatsAppLogs = useAdminStore((state) => state.whatsAppLogs);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            WhatsApp Dispatch & Notification Audit Log
          </h3>
        </div>

        {whatsAppLogs.length > 0 ? (
          <Table headers={['Customer', 'Phone', 'Message Content', 'Status', 'Sent Timestamp']}>
            {whatsAppLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{log.customerName}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.phone}</td>
                <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300 max-w-sm truncate">{log.message}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.timestamp}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title="No WhatsApp Logs Available"
            description="No WhatsApp logs available. This data will appear after backend integration."
            icon={<MessageCircle className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
