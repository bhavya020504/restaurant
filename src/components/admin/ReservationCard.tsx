import React from 'react';
import { Users, Calendar, Clock, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Reservation } from '../../types';
import { useAdminStore } from '../../store/useAdminStore';

export interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const updateReservationStatus = useAdminStore((state) => state.updateReservationStatus);

  const statusColors = {
    Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Confirmed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Seated: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Completed: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            {reservation.id}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
            {reservation.customerName}
          </h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[reservation.status]}`}>
          {reservation.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
          <span>{reservation.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500 shrink-0" />
          <span>{reservation.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-500 shrink-0" />
          <span>{reservation.guestsCount} Guests</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <span>{reservation.seatingPreference}</span>
        </div>
      </div>

      {reservation.specialRequest && (
        <p className="text-xs text-slate-500 italic bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
          "{reservation.specialRequest}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2">
        {reservation.status === 'Pending' && (
          <>
            <button
              onClick={() => updateReservationStatus(reservation.id, 'Confirmed')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors inline-flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Confirm
            </button>
            <button
              onClick={() => updateReservationStatus(reservation.id, 'Cancelled')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs hover:bg-rose-500 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Decline
            </button>
          </>
        )}

        {reservation.status === 'Confirmed' && (
          <button
            onClick={() => updateReservationStatus(reservation.id, 'Seated')}
            className="px-3 py-1.5 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition-colors"
          >
            Mark Seated
          </button>
        )}
      </div>
    </div>
  );
};
