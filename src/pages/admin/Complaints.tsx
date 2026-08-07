import React from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Complaints: React.FC = () => {
  const { complaints, updateComplaintStatus } = useAdminStore();

  const priorityColors = {
    Low: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    High: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    Critical: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-4">
          Customer Complaints Ticket Manager ({complaints.length})
        </h3>

        {complaints.length > 0 ? (
          <Table headers={['Complaint ID', 'Customer', 'Category & Issue', 'Priority', 'Status', 'Date', 'Action']}>
            {complaints.map((cmp) => (
              <tr key={cmp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-400">{cmp.id}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{cmp.customerName}</span>
                  <span className="block text-[11px] text-slate-400">{cmp.customerPhone}</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <span className="text-[10px] uppercase font-bold text-orange-500">{cmp.category}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{cmp.issue}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${priorityColors[cmp.priority]}`}>
                    {cmp.priority}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-xs">{cmp.status}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{cmp.date}</td>
                <td className="px-6 py-4">
                  {cmp.status !== 'Resolved' ? (
                    <Button
                      size="sm"
                      onClick={() => updateComplaintStatus(cmp.id, 'Resolved')}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Resolve
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-500 font-bold">Resolved ✓</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title="No Complaints Available"
            description="No complaints available. This data will appear after backend integration."
            icon={<AlertTriangle className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
