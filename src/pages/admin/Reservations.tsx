import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { ReservationCard } from '../../components/admin/ReservationCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar } from 'lucide-react';

export const Reservations: React.FC = () => {
  const { reservations } = useAdminStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerPhone.includes(search);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search reservation ID, customer..."
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                statusFilter === st
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Reservations Available"
          description="No reservations available. This data will appear after backend integration."
          icon={<Calendar className="w-8 h-8" />}
        />
      )}
    </div>
  );
};
