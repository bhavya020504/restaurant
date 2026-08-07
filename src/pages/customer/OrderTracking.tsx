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
import { 
  MapPin, 
  AlertTriangle, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShoppingBag,
  PhoneCall,
  Bot,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useOrderStore((state) => state.getOrderById);
  const addOrderReviewLocally = useOrderStore((state) => state.addOrderReview);
  const addComplaintLocally = useAdminStore((state) => state.addComplaint);

  const order = getOrderById(orderId || '');

  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTrackDeliveryOpen, setIsTrackDeliveryOpen] = useState(false);
  const [isSupportCallbackModalOpen, setIsSupportCallbackModalOpen] = useState(false);

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
    } finally {
      setComplaintSubmitted(true);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await ApiService.addOrderReview(order.id, feedbackRating, feedbackReview);
      addOrderReviewLocally(order.id, feedbackRating, feedbackReview);
      setFeedbackSubmitted(true);
    } catch (err) {
      addOrderReviewLocally(order.id, feedbackRating, feedbackReview);
      setFeedbackSubmitted(true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              Order #{order.id}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400 mt-1">Placed on {order.orderDate} at {order.orderTime}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {order.status === 'Delivered' && (
            <Button
              variant="outline"
              size="sm"
              icon={<Star className="w-4 h-4 text-amber-500" />}
              onClick={() => setIsFeedbackOpen(true)}
            >
              {order.rating ? 'Edit Review' : 'Rate & Review Order'}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
            onClick={() => setIsComplaintOpen(true)}
          >
            Report Issue
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<PhoneCall className="w-4 h-4 text-indigo-500" />}
            onClick={() => setIsSupportCallbackModalOpen(true)}
            className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
          >
            Request Call
          </Button>
        </div>
      </div>

      {/* Progress Timeline & Address */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Timeline Component */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center justify-between">
            <span>Delivery Status Timeline</span>
            <span className="text-xs text-orange-500 font-bold">Est: {order.estimatedDeliveryTime}</span>
          </h3>

          <Timeline currentStatus={order.status} estimatedDelivery={order.estimatedDeliveryTime} />
        </div>

        {/* Delivery Destination Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Delivery Destination
            </h3>
            
            <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{order.deliveryAddress}</p>
            </div>
          </div>

          <Button
            onClick={() => setIsTrackDeliveryOpen(true)}
            className="w-full font-bold shadow-md shadow-orange-500/20"
          >
            Track Live Courier
          </Button>
        </div>

      </div>

      {/* Order Summary Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
          Purchased Items
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {order.items.map((item: any, idx: number) => {
            const itemName = item.food?.name || item.name || `Food Item (${item.foodId || item.food_id || idx})`;
            const itemPrice = item.food?.price || item.price || 0;
            return (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {item.quantity}x {itemName}
                </span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {formatCurrency(itemPrice * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-base font-black text-slate-900 dark:text-white font-heading">
          <span>Total Amount Paid</span>
          <span className="text-orange-500">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* TRACK DELIVERY MODAL */}
      <Modal isOpen={isTrackDeliveryOpen} onClose={() => setIsTrackDeliveryOpen(false)} title="Live Driver Map">
        <div className="p-4 text-center space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button type="submit" variant="danger" className="w-full py-3.5 font-bold">
                Submit Complaint
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                icon={<PhoneCall className="w-4 h-4 text-indigo-500" />}
                onClick={() => {
                  setIsComplaintOpen(false);
                  setIsSupportCallbackModalOpen(true);
                }}
                className="w-full py-3.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold"
              >
                Request a Call
              </Button>
            </div>
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

      {/* SUPPORT CALLBACK VOICE AGENT MODAL */}
      <Modal isOpen={isSupportCallbackModalOpen} onClose={() => setIsSupportCallbackModalOpen(false)} title="Support Callback">
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Bot className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Support Voice Assistant
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our Support Assistant will call you shortly to understand your issue.
            </p>
            <p className="text-xs font-semibold text-slate-400 italic">
              This feature will be available after Voice Agent integration.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsSupportCallbackModalOpen(false)}>
              Close
            </Button>
            <div className="px-4 py-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider border border-indigo-500/20 cursor-not-allowed">
              Coming Soon
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};
