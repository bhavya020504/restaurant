import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_FOODS, MOCK_CATEGORIES, RESTAURANT_INFO } from '../../constants/mockData';
import { useOrderStore } from '../../store/useOrderStore';
import { FoodCard } from '../../components/customer/FoodCard';
import { CategoryCard } from '../../components/customer/CategoryCard';
import { Button } from '../../components/ui/Button';
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
  MessageSquare
} from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const Home: React.FC = () => {
  const featuredFoods = MOCK_FOODS.filter((f) => f.isFeatured);
  const popularFoods = MOCK_FOODS.filter((f) => f.isPopular);
  const orders = useOrderStore((state) => state.orders);
  const reviewedOrders = orders.filter((o) => typeof o.rating === 'number' && o.review);

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

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button size="lg" icon={<Utensils className="w-5 h-5" />} className="w-full font-bold py-4 shadow-lg shadow-orange-500/25">
                    Order Gourmet Food
                  </Button>
                </Link>
                <Link to="/reservation" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" icon={<Calendar className="w-5 h-5" />} className="w-full font-bold py-4">
                    Book Table
                  </Button>
                </Link>
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

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                  alt="Gourmet Dining"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-heading">Executive Master Chefs</div>
                  <div className="text-[10px] text-slate-400">Artisan Culinary Craftsmen</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Menu Categories</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">Explore Flavors</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline">
            View Full Catalog <ArrowRight className="w-4 h-4" />
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Chef Specials</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">Featured Creations</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline">
            See All Dishes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Most Ordered</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">Trending Dishes</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline">
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">The BR Standard</span>
            <h2 className="text-3xl font-black font-heading">Why Foodies Love BR KITCHEN</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Michelin-Trained Chefs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every recipe is designed by seasoned culinary artists using time-honored slow cooking & flame roasting techniques.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Thermal Express Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Custom thermal insulated containers maintain ideal serving temperature from oven to your dining table.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">100% Organic Sourcing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fresh ingredients delivered daily from certified sustainable local farms without preservatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED ORDER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Verified Customer Feedback</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">What Gourmet Lovers Say</h2>
        </div>

        {reviewedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewedOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold font-heading">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-heading">{order.customerName}</h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Verified Purchase (Order #{order.id})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: order.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
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

    </div>
  );
};
