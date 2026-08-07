import React from 'react';
import { Mail, Phone, Calendar, ShoppingBag, Award } from 'lucide-react';
import { Customer } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 font-heading">
                {customer.name}
              </h4>
              {customer.isVip && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Award className="w-3 h-3 text-amber-500" /> VIP
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Joined {customer.joinedDate}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{customer.phone}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Orders</span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-heading mt-0.5">
            {customer.totalOrders}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Spent</span>
          <p className="text-lg font-black text-orange-600 dark:text-orange-400 font-heading mt-0.5">
            {formatCurrency(customer.totalSpent)}
          </p>
        </div>
      </div>
    </div>
  );
};
