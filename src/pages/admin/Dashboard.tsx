import React, { useEffect } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useAdminStore } from '../../store/useAdminStore';
import { ApiService } from '../../services/api';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Table } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { DollarSign, ShoppingBag, Users, Calendar, AlertTriangle, Star, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);
  const { reservations, complaints } = useAdminStore();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await ApiService.getReservations();
        if (Array.isArray(data)) {
          const mapped = data.map((r: any) => ({
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
          useAdminStore.getState().setReservations(mapped);
        }
      } catch (err) {
        console.warn('Dashboard reservations fetch error:', err);
      }
    };
    fetchReservations();
  }, []);

  const todayRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const ratedOrders = orders.filter(o => typeof o.rating === 'number');
  const avgRating = ratedOrders.length > 0
    ? (ratedOrders.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedOrders.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8">
      
      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          change="—"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <DashboardCard
          title="Total Orders"
          value={orders.length}
          change="—"
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <DashboardCard
          title="Active Customers"
          value={orders.length > 0 ? new Set(orders.map(o => o.customerPhone)).size : 0}
          change="—"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
        />
        <DashboardCard
          title="Today's Reservations"
          value={reservations.length}
          change="—"
          isPositive={true}
          icon={<Calendar className="w-5 h-5" />}
        />
        <DashboardCard
          title="Open Complaints"
          value={complaints.filter((c) => c.status !== 'Resolved').length}
          change="—"
          isPositive={true}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <DashboardCard
          title="Avg Rating (Orders)"
          value={`${avgRating} ★`}
          change="—"
          isPositive={true}
          icon={<Star className="w-5 h-5" />}
        />
      </div>

      {/* Latest Live Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Recent Live Orders
            </h3>
            <p className="text-xs text-slate-400">Live order status updates from customer transactions</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length > 0 ? (
          <Table headers={['Order ID', 'Customer', 'Amount', 'Status', 'Date & Time']}>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{order.id}</td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{order.customerName}</span>
                  <span className="block text-[11px] text-slate-400">{order.customerPhone}</span>
                </td>
                <td className="px-6 py-4 font-black text-slate-900 dark:text-white font-heading">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {order.orderDate} {order.orderTime}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState
            title="No Active Orders"
            description="Live orders will appear here automatically when created."
            icon={<ShoppingBag className="w-8 h-8" />}
          />
        )}
      </div>

    </div>
  );
};
