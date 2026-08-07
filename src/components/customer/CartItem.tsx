import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

export interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <img
        src={item.food.image}
        alt={item.food.name}
        className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-heading truncate">
          {item.food.name}
        </h4>
        <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-0.5">
          {formatCurrency(item.food.price)} each
        </p>

        {item.specialInstructions && (
          <p className="text-[11px] text-slate-500 italic truncate mt-1">
            Note: "{item.specialInstructions}"
          </p>
        )}
      </div>

      {/* Quantity Counter */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
          className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Decrease Quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-6 text-center text-xs font-black text-slate-900 dark:text-slate-100">
          {item.quantity}
        </span>

        <button
          onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
          className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Increase Quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total & Remove */}
      <div className="text-right shrink-0 min-w-[70px]">
        <p className="font-black text-sm text-slate-900 dark:text-white font-heading">
          {formatCurrency(item.food.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.food.id)}
          className="mt-1 text-slate-400 hover:text-rose-500 transition-colors text-xs font-semibold inline-flex items-center gap-1"
          title="Remove Item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
