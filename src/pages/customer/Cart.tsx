import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { CartItem } from '../../components/customer/CartItem';
import { ShoppingBag, ArrowRight, Trash2, Tag, ShieldCheck, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getTax, getDeliveryFee, getTotal } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - discountAmount);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BRKITCHEN20') {
      setDiscountPercent(20);
      setPromoMsg('Promo BRKITCHEN20 applied! 20% discount added.');
    } else {
      setPromoMsg('Invalid promo code. Try BRKITCHEN20');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Looks like you haven't added any gourmet dishes yet. Explore our menu and indulge today!
        </p>
        <div>
          <Link to="/menu">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Explore Gourmet Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Order Summary</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">
            Your Cart ({items.length} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.food.id} item={item} />
          ))}

          <div className="pt-4">
            <Link to="/menu" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:underline">
              <ChevronLeft className="w-4 h-4" /> Add more items from menu
            </Link>
          </div>
        </div>

        {/* Order Breakdown Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Payment Summary
          </h3>

          {/* Promo code input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (BRKITCHEN20)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
              <Button size="sm" variant="outline" onClick={applyPromo}>
                Apply
              </Button>
            </div>
            {promoMsg && (
              <p className={`text-[11px] font-semibold ${discountPercent > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {promoMsg}
              </p>
            )}
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery Fee</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {deliveryFee === 0 ? <span className="text-emerald-500 uppercase font-black">FREE</span> : formatCurrency(deliveryFee)}
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Discount ({discountPercent}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Total Amount
            </span>
            <span className="text-2xl font-black text-orange-500 font-heading">
              {formatCurrency(finalTotal)}
            </span>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/checkout')}
            icon={<ArrowRight className="w-5 h-5" />}
            className="w-full py-3.5 shadow-lg shadow-orange-500/20"
          >
            Proceed to Checkout
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted SSL 256-bit Secure Checkout</span>
          </div>

        </div>

      </div>

    </div>
  );
};
