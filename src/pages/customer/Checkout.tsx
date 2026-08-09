import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ApiService } from '../../services/api';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MapPin, User, Phone, ShoppingBag, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getTax, getDeliveryFee, getTotal } = useCartStore();
  const createOrderLocally = useOrderStore((state) => state.createOrder);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotal();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    const deliveryAddress = street ? `${street}, ${city} ${zip}`.trim() : 'No address available';

    const payload = {
      customer_name: name || 'Customer',
      customer_phone: phone || '—',
      customer_email: currentUser?.email || '—',
      delivery_address: deliveryAddress,
      subtotal,
      tax: getTax(),
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      items: items.map(item => ({
        food_id: item.food.id,
        quantity: item.quantity,
        price: item.food.price
      }))
    };

    try {
      const serverOrder = await ApiService.createOrder(payload);
      clearCart();
      createOrderLocally({
        customerName: name || 'Customer',
        customerPhone: phone || '—',
        customerEmail: currentUser?.email || '—',
        deliveryAddress,
        paymentMethod: 'Credit Card',
        items,
        subtotal,
        tax: getTax(),
        deliveryFee,
        totalAmount
      });
      navigate(`/order-success/${serverOrder.id}`);
    } catch (error) {
      console.error('[Checkout API Error]', error);
      // Fallback local creation if server offline
      const newOrder = createOrderLocally({
        customerName: name || 'Customer',
        customerPhone: phone || '—',
        customerEmail: currentUser?.email || '—',
        deliveryAddress,
        paymentMethod: 'Credit Card',
        items,
        subtotal,
        tax: getTax(),
        deliveryFee,
        totalAmount
      });
      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
          Your Cart is Empty
        </h2>
        <Link to="/menu">
          <Button icon={<ArrowRight className="w-4 h-4" />}>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Order Confirmation</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">
            Checkout
          </h1>
        </div>
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Customer Information & Delivery Address */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer Information */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-800 pb-4">
              <User className="w-5 h-5 text-orange-500" />
              <h3>Customer Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-800 pb-4">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h3>Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-3">
                <Input
                  label="Street Address / Suite"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                required
              />
              <Input
                label="Postal ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter ZIP code"
                required
              />
            </div>
          </div>

        </div>

        {/* Order Summary & Action */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-800 pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[170px]">
                  <span className="text-orange-500 font-bold mr-1.5">{item.quantity}x</span>
                  {item.food.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(item.food.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {deliveryFee === 0 ? <span className="text-emerald-500 font-black uppercase">FREE</span> : formatCurrency(deliveryFee)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">Total</span>
            <span className="text-2xl font-black text-orange-500 font-heading">{formatCurrency(totalAmount)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full py-4 shadow-lg shadow-orange-500/20 font-bold text-base"
          >
            Place Order
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Order Transmission</span>
          </div>
        </div>

      </form>

    </div>
  );
};
