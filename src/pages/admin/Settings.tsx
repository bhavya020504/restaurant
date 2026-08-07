import React, { useState } from 'react';
import { RESTAURANT_INFO } from '../../constants/mockData';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Store, Clock, Bell, MessageCircle, Mail, PhoneCall, Calendar, Moon, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const [name, setName] = useState(RESTAURANT_INFO.name);
  const [phone, setPhone] = useState(RESTAURANT_INFO.phone);
  const [email, setEmail] = useState(RESTAURANT_INFO.email);
  const [address, setAddress] = useState(RESTAURANT_INFO.address);

  // Notification Toggles State
  const [whatsAppNotif, setWhatsAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [callNotif, setCallNotif] = useState(true);
  const [resNotif, setResNotif] = useState(true);

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Restaurant Info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Store className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Restaurant Profile Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Restaurant Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Concierge Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Support Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Physical Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Operating Business Hours
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {['Monday - Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{day}</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono">10:00 AM - 11:00 PM</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings Section (Toggle Cards) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Notification Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Toggle Card 1: WhatsApp Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp Notifications</h4>
                  <p className="text-[11px] text-slate-400">Order updates & links</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppNotif}
                onChange={(e) => setWhatsAppNotif(e.target.checked)}
                className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer"
              />
            </div>

            {/* Toggle Card 2: Email Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Email Notifications</h4>
                  <p className="text-[11px] text-slate-400">Invoices & confirmations</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer"
              />
            </div>

            {/* Toggle Card 3: Call Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Call Notifications</h4>
                  <p className="text-[11px] text-slate-400">Inbound concierge alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={callNotif}
                onChange={(e) => setCallNotif(e.target.checked)}
                className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer"
              />
            </div>

            {/* Toggle Card 4: Reservation Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Reservation Notifications</h4>
                  <p className="text-[11px] text-slate-400">New table requests</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={resNotif}
                onChange={(e) => setResNotif(e.target.checked)}
                className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer"
              />
            </div>

            {/* Toggle Card 5: Dark Mode */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</h4>
                  <p className="text-[11px] text-slate-400">Toggle between dark slate and light theme</p>
                </div>
              </div>
              <ThemeToggle />
            </div>

          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" size="lg" className="font-bold shadow-lg shadow-orange-500/20">
            Save Platform Settings
          </Button>

          {savedToast && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved!
            </div>
          )}
        </div>

      </form>

    </div>
  );
};
