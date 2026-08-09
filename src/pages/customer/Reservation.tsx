import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiService } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RESTAURANT_INFO } from '../../constants/mockData';
import { 
  Calendar as CalendarIcon, 
  Clock3, 
  Users, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  MapPin,
  PhoneCall,
  Bot,
  Home
} from 'lucide-react';

export const Reservation: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const addReservationLocally = useAdminStore((state) => state.addReservation);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [guestsCount, setGuestsCount] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('07:00 PM');
  const [seatingPreference, setSeatingPreference] = useState<'Indoor' | 'Outdoor' | 'Private Room' | 'Window View'>('Indoor');
  const [specialRequest, setSpecialRequest] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCallReserveModalOpen, setIsCallReserveModalOpen] = useState(false);
  const [callReservePhone, setCallReservePhone] = useState('');
  const [callReserveName, setCallReserveName] = useState('');
  const [callReserveEmail, setCallReserveEmail] = useState('');
  const [callReserveLoading, setCallReserveLoading] = useState(false);
  const [callReserveSuccess, setCallReserveSuccess] = useState<string | null>(null);
  const [callReserveError, setCallReserveError] = useState<string | null>(null);

  const handleTriggerAIReservationCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallReserveError(null);
    setCallReserveSuccess(null);

    const cleanPhone = callReservePhone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setCallReserveError('Please enter a valid phone number.');
      return;
    }

    setCallReserveLoading(true);

    try {
      const res = await ApiService.triggerAIReservationCall({
        phone_number: callReservePhone,
        name: callReserveName.trim() || undefined,
        email: callReserveEmail.trim() || undefined
      });

      if (res && res.success) {
        setCallReserveSuccess(res.message || "You're all set! Our AI reservation assistant will call you shortly.");
        setTimeout(() => {
          setIsCallReserveModalOpen(false);
          setCallReserveSuccess(null);
          setCallReservePhone('');
          setCallReserveName('');
          setCallReserveEmail('');
        }, 2500);
      } else {
        setCallReserveError("Sorry, we couldn't connect the reservation assistant right now. Please try again.");
      }
    } catch (err: any) {
      console.error("AI Reservation Call trigger failed:", err);
      setCallReserveError("Sorry, we couldn't connect the reservation assistant right now. Please try again.");
    } finally {
      setCallReserveLoading(false);
    }
  };
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);

  const availableTimeSlots = [
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
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            {/* Date & Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Reservation Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                leftIcon={<CalendarIcon className="w-4 h-4" />}
              />
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      time === slot
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500/50'
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

            {/* Action Buttons: Book Table & Call & Reserve */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold shadow-lg shadow-orange-500/20 py-4 bg-orange-500 hover:bg-orange-600"
              >
                Book Table
              </Button>

              <div className="relative">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  icon={<PhoneCall className="w-5 h-5 text-indigo-500" />}
                  onClick={() => setIsCallReserveModalOpen(true)}
                  className="w-full font-bold py-4 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                >
                  Call & Reserve
                </Button>
                <span className="absolute -top-3 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500 text-white shadow-sm border border-white dark:border-slate-900">
                  Coming Soon • Voice AI
                </span>
              </div>
            </div>

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

      {/* 1. RESERVATION SUCCESS CONFIRMATION MODAL */}
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="Reservation Submitted">
        {confirmedReservation && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                Reservation Submitted
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-medium">
                Your reservation request has been received. Our Reservation Assistant will call you shortly to confirm your reservation.
              </p>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5" /> Status: Pending Confirmation
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs space-y-2 text-left border border-slate-200/80 dark:border-slate-700">
              <p><strong>Booking Ref:</strong> {confirmedReservation.id}</p>
              <p><strong>Customer:</strong> {confirmedReservation.customerName}</p>
              <p><strong>Guests:</strong> {confirmedReservation.guestsCount} Persons</p>
              <p><strong>Requested Date & Time:</strong> {confirmedReservation.date} at {confirmedReservation.time}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button onClick={() => setIsOpenModal(false)} variant="outline" className="w-full">
                Close
              </Button>
              <Link to="/profile" className="w-full">
                <Button className="w-full font-bold">
                  View Reservation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. CALL & RESERVE VOICE AGENT MODAL */}
      <Modal 
        isOpen={isCallReserveModalOpen} 
        onClose={() => {
          if (!callReserveLoading) setIsCallReserveModalOpen(false);
        }} 
        title="Call & Reserve"
      >
        <form onSubmit={handleTriggerAIReservationCall} className="space-y-5 text-left py-2">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-7 h-7" />
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> AI Reservation Assistant
            </span>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              Give us your phone number and our AI reservation assistant will call you and help reserve your table.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {callReserveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{callReserveSuccess}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {callReserveError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{callReserveError}</span>
            </div>
          )}

          {/* INPUT FORM FIELDS */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={callReservePhone}
                onChange={(e) => setCallReservePhone(e.target.value)}
                placeholder="+91 97899 81433 or 10-digit number"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Name <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={callReserveName}
                onChange={(e) => setCallReserveName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={callReserveEmail}
                onChange={(e) => setCallReserveEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button 
              type="button" 
              variant="outline" 
              disabled={callReserveLoading} 
              onClick={() => setIsCallReserveModalOpen(false)}
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={callReserveLoading || !callReservePhone.trim()} 
              icon={<PhoneCall className="w-4 h-4" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              {callReserveLoading ? 'Connecting...' : 'Call Me'}
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
