import React, { useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Table } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, ShoppingBag, Star } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Preparing');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);

    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrderStatus(editingOrder.id, newStatus);
      setEditingOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Order ID, customer..."
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Pending', 'Preparing', 'Cooking', 'Out For Delivery', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                selectedStatus === status
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table or Empty State */}
      {filteredOrders.length > 0 ? (
        <Table headers={['Order ID', 'Customer', 'Items', 'Amount', 'Rating & Review', 'Status', 'Date & Time', 'Action']}>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">{order.id}</td>
              <td className="px-6 py-4">
                <span className="font-bold text-slate-900 dark:text-slate-100">{order.customerName}</span>
                <span className="block text-[11px] text-slate-400">{order.customerPhone}</span>
                {order.customerEmail && <span className="block text-[11px] text-slate-400">{order.customerEmail}</span>}
              </td>
              <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                {order.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
              </td>
              <td className="px-6 py-4 font-black text-slate-900 dark:text-white font-heading">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="px-6 py-4 text-xs">
                {order.rating ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(order.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">({order.rating}/5)</span>
                    </div>
                    {order.review && (
                      <p className="text-[11px] text-slate-500 italic max-w-xs truncate">"{order.review}"</p>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No review yet</span>
                )}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">
                {order.orderDate} {order.orderTime}
              </td>
              <td className="px-6 py-4">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingOrder(order);
                    setNewStatus(order.status);
                  }}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState
          title="No Orders Available"
          description="Orders and customer reviews will appear here live."
          icon={<ShoppingBag className="w-8 h-8" />}
        />
      )}

      {/* Status Update Modal */}
      <Modal isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} title={`Update Status - ${editingOrder?.id}`}>
        {editingOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Current Status: <strong>{editingOrder.status}</strong>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Cooking">Cooking</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <Button type="submit" className="w-full font-bold">
              Save New Status
            </Button>
          </form>
        )}
      </Modal>

    </div>
  );
};
