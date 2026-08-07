import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';

export interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Order #{order.id}
          </span>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {order.orderDate} at {order.orderTime}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items list preview */}
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold">
              <span className="text-orange-500 font-bold mr-1.5">{item.quantity}x</span>
              {item.food.name}
            </span>
            <span className="font-bold">{formatCurrency(item.food.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Footer Details & Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Amount</span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-heading">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        <Link
          to={`/order-tracking/${order.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-200 transition-colors"
        >
          <span>Track Order</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
