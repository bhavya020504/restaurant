import React from 'react';
import { CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../types';

export interface TimelineProps {
  currentStatus: OrderStatus;
  estimatedDelivery?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ currentStatus, estimatedDelivery }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Order received & queued', icon: Clock },
    { key: 'Preparing', label: 'Preparing', desc: 'Fresh ingredients prepped', icon: Clock },
    { key: 'Cooking', label: 'Cooking', desc: 'Executive Chef baking & cooking', icon: Clock },
    { key: 'Out For Delivery', label: 'Out For Delivery', desc: 'Driver en route to your address', icon: Truck },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: Home }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'Cooking': return 2;
      case 'Out For Delivery': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center gap-4 text-rose-700 dark:text-rose-400">
        <AlertCircle className="w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-bold text-base font-heading">Order Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-300">This order was cancelled. Please contact concierge support if you have questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Desktop Step Bar */}
      <div className="relative flex items-center justify-between">
        {/* Progress Line background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Progress Fill */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-700 ease-out rounded-full"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center text-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 text-orange-600 border-2 border-orange-500 shadow-lg ring-4 ring-orange-500/10 scale-110'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <span
                className={`mt-3 text-xs font-semibold max-w-[90px] ${
                  isCurrent
                    ? 'text-orange-600 dark:text-orange-400 font-bold'
                    : isDone
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {estimatedDelivery && (
        <div className="mt-8 text-center bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 rounded-2xl p-4">
          <p className="text-xs uppercase font-semibold tracking-wider text-orange-600 dark:text-orange-400">
            Estimated Delivery Time
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 font-heading mt-0.5">
            {estimatedDelivery}
          </p>
        </div>
      )}
    </div>
  );
};
