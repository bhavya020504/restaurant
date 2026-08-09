import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_FOODS, MOCK_CATEGORIES, RESTAURANT_INFO } from '../../constants/mockData';
import { useOrderStore } from '../../store/useOrderStore';
import { ApiService } from '../../services/api';
import { FoodCard } from '../../components/customer/FoodCard';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  Utensils, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  Star, 
  ChefHat, 
  Truck, 
  Calendar,
  MessageSquare,
  PhoneCall,
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Home: React.FC = () => {
  const featuredFoods = MOCK_FOODS.filter((f) => f.isFeatured);
  const popularFoods = MOCK_FOODS.filter((f) => f.isPopular);
  const orders = useOrderStore((state) => state.orders);
  const reviewedOrders = orders.filter((o) => typeof o.rating === 'number' && o.review);

  // Call & Order Voice Assistant Modal State
  const [isCallOrderModalOpen, setIsCallOrderModalOpen] = useState(false);
  const [callPhone, setCallPhone] = useState('');
  const [callName, setCallName] = useState('');
  const [callEmail, setCallEmail] = useState('');
  const [callLoading, setCallLoading] = useState(false);
  const [callSuccess, setCallSuccess] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);

  const handleTriggerAICall = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallError(null);
    setCallSuccess(null);

    const cleanPhone = callPhone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setCallError('Please enter a valid phone number with at least 10 digits.');
      return;
    }

    setCallLoading(true);

    try {
      const res = await ApiService.triggerAIOrderCall({
        phone_number: callPhone,
        name: callName.trim() || undefined,
        email: callEmail.trim() || undefined
      });

      if (res && res.success) {
        setCallSuccess(res.message || "You're all set! Our AI ordering assistant will call you shortly.");
        setTimeout(() => {
          setIsCallOrderModalOpen(false);
          setCallSuccess(null);
          setCallPhone('');
          setCallName('');
          setCallEmail('');
        }, 2500);
      } else {
        setCallError("Sorry, we couldn't connect the call right now. Please try again.");
      }
    } catch (err: any) {
      console.error("AI Call trigger failed:", err);
      setCallError("Sorry, we couldn't connect the call right now. Please try again.");
    } finally {
      setCallLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> {RESTAURANT_INFO.tagline}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white font-heading leading-tight">
                Crafted Culinary Excellence Delivered Hot
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience A5 Wagyu Reserve burgers, artisanal sourdough woodfired pizzas, and pan-seared Chilean sea bass created by executive chefs.
              </p>

              {/* Dual CTAs: Order Online & Call & Order */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button size="lg" icon={<Utensils className="w-5 h-5" />} className="w-full font-bold py-4 shadow-lg shadow-orange-500/25 bg-orange-500 hover:bg-orange-600">
                    Order Online
                  </Button>
                </Link>

                <div className="w-full sm:w-auto relative">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    icon={<PhoneCall className="w-5 h-5 text-indigo-500" />} 
                    onClick={() => setIsCallOrderModalOpen(true)}
                    className="w-full font-bold py-4 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 shadow-sm"
                  >
                    Call & Order
                  </Button>
                  <span className="absolute -top-3 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm border border-white dark:border-slate-900">
                    Voice AI Assistant
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-heading">15 Mins</div>
                  <div className="text-xs text-slate-400">Avg Prep Time</div>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-heading">4.9 ★</div>
                  <div className="text-xs text-slate-400">Rating</div>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-heading">100%</div>
                  <div className="text-xs text-slate-400">Organic Produce</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80" 
                  alt="BR Kitchen Signature Steak"
                  className="w-full h-[400px] lg:h-[480px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Floating Highlight Card */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-400">
                    <span>Chef's Choice</span>
                    <span>98% Positive Feedback</span>
                  </div>
                  <div className="text-lg font-black font-heading">A5 Wagyu Reserve Burger</div>
                  <p className="text-xs text-slate-300">Truffle butter, aged Gruyère, smoked bacon jam on brioche</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
              Explore Our Menu
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a category to view hand-crafted gourmet dishes
            </p>
          </div>
          <Link to="/menu" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">Hand-Picked Selection</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
              Chef's Special Recommendations
            </h2>
          </div>
          <Link to="/menu" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
            Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
              Most Popular Among Guests
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 5. VERIFIED REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">Guest Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
            Verified Customer Reviews
          </h2>
        </div>

        {reviewedOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewedOrders.map((order) => (
              <div 
                key={order.id} 
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{order.customerName}</div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" /> {order.rating}/5
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Order #{order.id} • {order.orderDate}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{order.review}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Reviews Submitted Yet"
            description="Verified order reviews will appear here automatically when submitted by customers."
            icon={<MessageSquare className="w-8 h-8" />}
          />
        )}
      </section>

      {/* CALL & ORDER VOICE AGENT MODAL */}
      <Modal
        isOpen={isCallOrderModalOpen}
        onClose={() => {
          if (!callLoading) setIsCallOrderModalOpen(false);
        }}
        title="Call & Order with Voice AI"
      >
        <form onSubmit={handleTriggerAICall} className="space-y-5 text-left py-2">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-7 h-7" />
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> BR Kitchen AI Executive
            </span>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              We'll call your phone with our AI ordering assistant to help you choose and place your order.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {callSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{callSuccess}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {callError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{callError}</span>
            </div>
          )}

          {/* INPUT FORM FIELDS */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={callPhone}
                onChange={(e) => setCallPhone(e.target.value)}
                placeholder="+91 97899 81433 or 10-digit number"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Name <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={callName}
                onChange={(e) => setCallName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={callEmail}
                onChange={(e) => setCallEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button 
              type="button" 
              variant="outline" 
              disabled={callLoading} 
              onClick={() => setIsCallOrderModalOpen(false)}
            >
              Cancel
            </Button>

            <Button 
              type="submit" 
              disabled={callLoading || !callPhone.trim()} 
              icon={callLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              {callLoading ? 'Connecting...' : 'Call Me'}
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
