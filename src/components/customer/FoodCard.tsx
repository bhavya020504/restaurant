import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Flame, Leaf, Clock } from 'lucide-react';
import { FoodItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../ui/Button';

export interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(food, 1);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Container */}
      <Link to={`/food/${food.id}`} className="block relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {food.isVeg && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          )}
          {food.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
          {food.isPopular && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-500 text-white shadow-xs uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Rating pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{food.rating}</span>
          <span className="text-[10px] text-slate-400">({food.reviewCount})</span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">{food.category}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {food.prepTimeMinutes} mins</span>
          </div>

          <Link to={`/food/${food.id}`} className="block group-hover:text-orange-500 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading line-clamp-1">
              {food.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-lg font-black text-slate-900 dark:text-white font-heading">
            {formatCurrency(food.price)}
          </span>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!food.inStock}
            icon={<Plus className="w-4 h-4" />}
            className="rounded-xl font-bold"
          >
            {food.inStock ? 'Add' : 'Out of Stock'}
          </Button>
        </div>
      </div>

    </div>
  );
};
