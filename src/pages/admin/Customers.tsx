import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { CustomerCard } from '../../components/admin/CustomerCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Users } from 'lucide-react';
import { Customer } from '../../types';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCustomers = async () => {
      try {
        const data = await ApiService.getCustomers();
        if (isMounted && Array.isArray(data)) {
          const mappedCustomers: Customer[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            avatar: c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            joinedDate: c.joined_date || (c.created_at ? c.created_at.substring(0, 10) : '—'),
            totalOrders: c.total_orders || 0,
            totalSpent: c.total_spent || 0,
            savedAddresses: [],
            isVip: c.is_vip || false
          }));
          setCustomers(mappedCustomers);
        }
      } catch (err) {
        console.warn('Backend customers fetch deferred:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCustomers();
    return () => { isMounted = false; };
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search customer name, email..."
          />
        </div>
        <p className="text-xs text-slate-400 font-semibold">Total Registered: {customers.length}</p>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((cust) => (
            <CustomerCard key={cust.id} customer={cust} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Registered Customers"
          description="Registered customer profiles will appear here automatically when accounts are created."
          icon={<Users className="w-8 h-8" />}
        />
      )}

    </div>
  );
};
