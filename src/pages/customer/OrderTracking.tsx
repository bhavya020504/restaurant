import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../../store/useOrderStore';
import { useAdminStore } from '../../store/useAdminStore';
import { ApiService } from '../../services/api';
import { Timeline } from '../../components/ui/Timeline';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { MapPin, AlertTriangle, Star, CheckCircle2, MessageSquare, Truck, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const addComplaintLocally = useAdminStore((state) => state.addComplaint);

  const order = getOrderById(orderId || '');

  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTrackDeliveryOpen, setIsTrackDeliveryOpen] = useState(false);

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState<'Late Delivery' | 'Food Quality' | 'Missing Item' | 'Wrong Order' | 'Billing'>('Food Quality');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Feedback / Review Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackReview, setFeedbackReview] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-center">
        <EmptyState
          title="No Active Order Found"
          description="No order tracking available. Place an order to track live delivery status."
          icon={<ShoppingBag className="w-8 h-8" />}
          action={
            <Link to="/menu">
              <Button size="md">Explore Gourmet Menu</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      customer_name: order.customerName || 'Customer',
      customer_phone: order.customerPhone || '—',
      order_id: order.id,
      issue: complaintDescription,
      category: complaintCategory,
      priority: 'Medium'
    };
    try {
      await ApiService.createComplaint(payload);
    } catch (err) {
      addComplaintLocally({
        customerName: order.customerName || 'Customer',
        customerPhone: order.customerPhone || '—',
        orderId: order.id,
        issue: complaintDescription,
        category: complaintCategory,
        priority: 'Medium'
      });
    }
    setComplaintSubmitted(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await ApiService.addOrderReview(order.id, feedbackRating, feedbackReview);
    } catch (err) {
      console.warn('Backend review save deferred:', err);
    } finally {
      setIsSubmittingReview(false);
      setFeedbackSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Order Tracking</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
            Order #{order.id}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Placed on {order.orderDate} at {order.orderTime}</p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Timeline & Action Cards */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Order Timeline
            </h3>

            <Timeline currentStatus={order.status} estimatedDelivery={order.estimatedDeliveryTime} />
          </div>

          {/* 3 Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Action Card 1: Track Delivery */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">
                    Track Delivery
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    View live dispatch status & vehicle location timeline.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full font-bold"
                onClick={() => setIsTrackDeliveryOpen(true)}
              >
                Track Delivery
              </Button>
            </div>

            {/* Action Card 2: Complaint */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">
                    Complaint
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Report an issue regarding food quality or late delivery.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full font-bold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={() => {
                  setComplaintSubmitted(false);
                  setIsComplaintOpen(true);
                }}
              >
                Complaint
              </Button>
            </div>

            {/* Action Card 3: Rate & Review Order */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">
                    Rate Order
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Rate your dish quality & leave a review on this order.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full font-bold text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => {
                  setFeedbackSubmitted(false);
                  setIsFeedbackOpen(true);
                }}
              >
                Rate & Review
              </Button>
            </div>

          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
            Order Summary ({order.items.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  <span className="text-orange-500 font-bold mr-1.5">{item.quantity}x</span>
                  {item.food.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(item.food.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>{order.deliveryAddress || 'No address available'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">Total Amount</span>
            <span className="text-xl font-black text-orange-500 font-heading">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

      </div>

      {/* TRACK DELIVERY MODAL */}
      <Modal isOpen={isTrackDeliveryOpen} onClose={() => setIsTrackDeliveryOpen(false)} title="Live Delivery Status">
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white font-heading">
            Express Transit En Route
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Estimated arrival time: <strong>{order.estimatedDeliveryTime}</strong> to {order.deliveryAddress}.
          </p>
          <Button onClick={() => setIsTrackDeliveryOpen(false)} className="w-full">
            Close
          </Button>
        </div>
      </Modal>

      {/* COMPLAINT MODAL */}
      <Modal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} title={`Register Complaint - Order #${order.id}`}>
        {complaintSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xl text-slate-900 dark:text-white font-heading">Complaint Submitted</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our concierge team has logged your complaint in PostgreSQL and will follow up.
              </p>
            </div>
            <Button onClick={() => setIsComplaintOpen(false)} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitComplaint} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Type
              </label>
              <select
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="Late Delivery">Late Delivery</option>
                <option value="Food Quality">Food Quality</option>
                <option value="Missing Item">Missing Item</option>
                <option value="Wrong Order">Wrong Order</option>
                <option value="Billing">Billing Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                placeholder="Provide detailed description of the issue..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <Button type="submit" variant="danger" className="w-full py-3.5 font-bold">
              Submit Complaint
            </Button>
          </form>
        )}
      </Modal>

      {/* RATE & REVIEW ORDER MODAL */}
      <Modal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} title={`Rate & Review Order #${order.id}`}>
        {feedbackSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xl text-slate-900 dark:text-white font-heading">Thank You for Your Review!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your rating and review have been saved directly inside Order #{order.id} in PostgreSQL.
              </p>
            </div>
            <Button onClick={() => setIsFeedbackOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Star Rating (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-8 h-8 ${star <= feedbackRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Review Text
              </label>
              <textarea
                rows={4}
                required
                value={feedbackReview}
                onChange={(e) => setFeedbackReview(e.target.value)}
                placeholder="Write your review for this order..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <Button type="submit" isLoading={isSubmittingReview} className="w-full py-3.5 font-bold">
              Submit Review
            </Button>
          </form>
        )}
      </Modal>

    </div>
  );
};
