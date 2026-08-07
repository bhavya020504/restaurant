import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMenuStore } from '../../store/useMenuStore';
import { useCartStore } from '../../store/useCartStore';
import { 
  Star, 
  Clock, 
  Flame, 
  Leaf, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const foods = useMenuStore((state) => state.foods);
  const addItem = useCartStore((state) => state.addItem);

  const food = foods.find((f) => f.id === id) || foods[0];
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    addItem(food, quantity, [], instructions);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link
        to="/menu"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Food Image Container */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl aspect-4/3">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 flex gap-2">
            {food.isVeg && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Vegetarian
              </span>
            )}
            {food.isSpicy && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Spicy
              </span>
            )}
          </div>
        </div>

        {/* Info & Cart Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span className="uppercase tracking-wider text-orange-600 dark:text-orange-400">{food.category}</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-slate-800 dark:text-slate-200">{food.rating} ({food.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">
              {food.name}
            </h1>

            <p className="text-2xl font-black text-orange-500 font-heading mt-2">
              {formatCurrency(food.price)}
            </p>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
            {food.description}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Prep Time: <strong>{food.prepTimeMinutes} mins</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Energy: <strong>{food.calories} kcal</strong></span>
            </div>
          </div>

          {/* Ingredients list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fresh Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Special instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra sauce, no onions, sauce on the side..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-full sm:w-auto justify-between">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-orange-500 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-black text-base text-slate-900 dark:text-white font-heading">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-orange-500 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              icon={<ShoppingBag className="w-5 h-5" />}
              className="w-full sm:flex-1 py-3.5 shadow-lg shadow-orange-500/20"
            >
              Add {quantity} to Cart • {formatCurrency(food.price * quantity)}
            </Button>

          </div>

          {addedToast && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Added to cart successfully!</span>
              </div>
              <Link to="/cart" className="underline text-xs font-black">
                View Cart →
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
