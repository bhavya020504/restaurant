import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAdminStore } from '../../store/useAdminStore';
import { User, MapPin, ShoppingBag, Calendar, Settings, Plus, Mail, Phone, Award } from 'lucide-react';
import { OrderCard } from '../../components/customer/OrderCard';
import { ReservationCard } from '../../components/admin/ReservationCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile, logoutCustomer } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const reservations = useAdminStore((state) => state.reservations);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'reservations' | 'settings'>('profile');

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const customerOrders = orders.filter(
    (o) => (currentUser && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) || o.customerName === (currentUser?.name || 'Customer')
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const displayName = currentUser?.name || 'Customer';
  const displayEmail = currentUser?.email || '—';
  const displayPhone = currentUser?.phone || '—';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={displayName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                {displayName}
              </h1>
              {currentUser?.isVip && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> VIP Member
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{displayEmail}</p>
            <p className="text-xs text-slate-400">Phone: {displayPhone}</p>
          </div>
        </div>

        {currentUser && (
          <Button variant="outline" size="sm" onClick={logoutCustomer}>
            Sign Out
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'profile', label: 'Customer Details', icon: User },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'orders', label: `Previous Orders (${customerOrders.length})`, icon: ShoppingBag },
          { id: 'reservations', label: 'Reservations', icon: Calendar },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                active
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Personal Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button type="submit" className="font-bold">
              Save Profile Changes
            </Button>

            {savedSuccess && (
              <p className="text-xs font-bold text-emerald-500">Profile updated successfully!</p>
            )}
          </form>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Delivery Locations
            </h3>
            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
              Add New Address
            </Button>
          </div>

          {(currentUser?.savedAddresses || []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentUser?.savedAddresses || []).map((addr) => (
                <div key={addr.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/10 text-orange-600 border border-orange-500/20 uppercase">
                      Default Address
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base font-heading">{addr.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{addr.street}, {addr.city}, {addr.zipCode}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No saved addresses." description="Your delivery addresses will appear here." />
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Your Order History
          </h3>

          {customerOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customerOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <EmptyState title="No orders yet." description="Your placed orders will appear here after backend integration." />
          )}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Your Table Reservations
          </h3>

          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map((res) => (
                <ReservationCard key={res.id} reservation={res} />
              ))}
            </div>
          ) : (
            <EmptyState title="No reservations yet." description="Your submitted table reservations will appear here after backend integration." />
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Preferences & Notifications
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">SMS Order Updates</h4>
                <p className="text-xs text-slate-400">Receive real-time order status texts</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500 rounded-md" />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Promotional Emails</h4>
                <p className="text-xs text-slate-400">Weekly chef specials & promo codes</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500 rounded-md" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
