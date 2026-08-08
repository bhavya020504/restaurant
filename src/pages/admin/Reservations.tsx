import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { ReservationCard } from '../../components/admin/ReservationCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Calendar } from 'lucide-react';
import { Reservation } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';

export const Reservations: React.FC = () => {
  const setStoreReservations = useAdminStore((state) => state.setReservations);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getReservations();
      if (Array.isArray(data)) {
        const mapped: Reservation[] = data.map((r: any) => ({
          id: r.id,
          customerId: r.customer_id,
          customerName: r.customer_name || 'Customer',
          customerPhone: r.customer_phone || '—',
          customerEmail: r.customer_email || '—',
          guestsCount: r.guests_count || 1,
          date: r.date || '—',
          time: r.time || '—',
          seatingPreference: r.seating_preference || 'Indoor',
          status: r.status || 'Pending',
          specialRequest: r.special_request || undefined,
          createdAt: r.created_at || new Date().toISOString()
        }));
        setReservations(mapped);
        setStoreReservations(mapped);
      }
    } catch (err) {
      console.warn('Backend reservations fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusUpdate = async (resId: string, newStatus: string) => {
    try {
      await ApiService.updateReservationStatus(resId, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: newStatus as any } : r))
      );
      useAdminStore.getState().updateReservationStatus(resId, newStatus as any);
    } catch (err) {
      setReservations((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: newStatus as any } : r))
      );
      useAdminStore.getState().updateReservationStatus(resId, newStatus as any);
    }
  };

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
      
      {/* Controls Header */}
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

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <ReservationCard 
              key={res.id} 
              reservation={res} 
              onStatusChange={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Reservations Available"
          description="Table reservation records will appear here automatically when booked."
          icon={<Calendar className="w-8 h-8" />}
        />
      )}

    </div>
  );
};
