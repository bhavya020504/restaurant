import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Home, ArrowRight, ShieldAlert } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { Button } from '../../components/ui/Button';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const order = getOrderById(orderId || '') || {
    id: orderId || 'BR-0000',
    customerName: 'Customer',
    estimatedDeliveryTime: '30-40 mins',
    deliveryAddress: 'No address available'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Success Badge Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          Order Received
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
          Order Successfully Placed
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto font-medium">
          Our team will review your order before confirmation.
        </p>
      </div>

      {/* Details Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm text-left max-w-lg mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Order Number</span>
            <p className="text-xl font-black text-orange-500 font-heading">{order.id}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Estimated Delivery Time</span>
            <p className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4 text-orange-500" /> {order.estimatedDeliveryTime}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-700 dark:text-orange-300 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Order Status Notice:</strong> Our team will review your order details before final confirmation and dispatch.
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to={`/order-tracking/${order.id}`}>
          <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} className="shadow-lg shadow-orange-500/20">
            Track Order
          </Button>
        </Link>

        <Link to="/">
          <Button size="lg" variant="outline" icon={<Home className="w-5 h-5" />}>
            Go Home
          </Button>
        </Link>
      </div>

    </div>
  );
};
