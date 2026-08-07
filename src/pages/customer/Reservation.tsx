import React, { useState } from 'react';
import { ApiService } from '../../services/api';
import { useAdminStore } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Calendar, Clock, Users, MapPin, Sparkles, CheckCircle2, User, Phone, Mail, Clock3 } from 'lucide-react';
import { RESTAURANT_INFO } from '../../constants/mockData';

export const Reservation: React.FC = () => {
  const addReservationLocally = useAdminStore((state) => state.addReservation);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [guestsCount, setGuestsCount] = useState(2);
  const [date, setDate] = useState('2026-08-07');
  const [time, setTime] = useState('07:30 PM');
  const [seatingPreference, setSeatingPreference] = useState<'Indoor' | 'Outdoor' | 'Private Room' | 'Window View'>('Outdoor');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const timeSlots = [
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      guests_count: guestsCount,
      date,
      time,
      seating_preference: seatingPreference,
      special_request: specialRequest
    };

    try {
      const createdRes = await ApiService.createReservation(payload);
      setConfirmedReservation({
        id: createdRes.id,
        customerName: createdRes.customer_name,
        guestsCount: createdRes.guests_count,
        date: createdRes.date,
        time: createdRes.time
      });
      addReservationLocally({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        guestsCount,
        date,
        time,
        seatingPreference,
        specialRequest
      });
    } catch (error) {
      // Fallback local registration if server unreachable
      const res = addReservationLocally({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        guestsCount,
        date,
        time,
        seatingPreference,
        specialRequest
      });
      setConfirmedReservation(res);
    } finally {
      setIsSubmitting(false);
      setIsOpenModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Table Reservation Request
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white font-heading">
          Reserve Your Table
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Submit your table request at {RESTAURANT_INFO.name}. Our host team will review and confirm availability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Customer info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <div className="md:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Guests & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 font-black text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-xs"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-orange-500" /> {guestsCount} Guest(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestsCount(guestsCount + 1)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 font-black text-slate-800 dark:text-slate-200 flex items-center justify-center shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Reservation Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                Select Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      time === slot
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500/40'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                Seating Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Indoor', 'Outdoor', 'Private Room', 'Window View'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setSeatingPreference(pref as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      seatingPreference === pref
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                Special Occasion / Request (Optional)
              </label>
              <textarea
                rows={3}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Birthday celebration, anniversary..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-lg shadow-orange-500/20 py-3.5"
            >
              Book Table
            </Button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
          <h3 className="text-xl font-bold font-heading">Reservation Guidelines</h3>
          
          <ul className="space-y-4 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <Clock3 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <span>All table requests are reviewed by our host team before confirmation.</span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <span>For parties larger than 10 guests, please contact concierge directly.</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <span>{RESTAURANT_INFO.address}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="Request Submitted">
        {confirmedReservation && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                Reservation Submitted Successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Our team will review your reservation request and confirm it shortly.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs space-y-2 text-left">
              <p><strong>Booking Ref:</strong> {confirmedReservation.id}</p>
              <p><strong>Customer:</strong> {confirmedReservation.customerName}</p>
              <p><strong>Guests:</strong> {confirmedReservation.guestsCount} Persons</p>
              <p><strong>Requested Date & Time:</strong> {confirmedReservation.date} at {confirmedReservation.time}</p>
            </div>

            <Button onClick={() => setIsOpenModal(false)} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Modal>

    </div>
  );
};
