import React from 'react';
import { EmptyState } from './EmptyState';

export interface TableProps {
  headers: string[];
  children: React.ReactNode;
  emptyText?: string;
  isEmpty?: boolean;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  emptyText = 'No data available. This data will appear after backend integration.',
  isEmpty = false
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col" className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center">
                <EmptyState description={emptyText} />
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};
