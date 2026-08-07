import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Table } from '../../components/ui/Table';
import { Mail } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const EmailLogs: React.FC = () => {
  const emailLogs = useAdminStore((state) => state.emailLogs);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Email System Audit Log
          </h3>
        </div>

        {emailLogs.length > 0 ? (
          <Table headers={['Customer', 'Email Address', 'Email Type', 'Status', 'Sent Time']}>
            {emailLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{log.customerName}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.email}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">{log.emailType}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.sentTime}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title="No Email Logs Available"
            description="No email logs available. This data will appear after backend integration."
            icon={<Mail className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
