import React from 'react';
import { Category } from '../../types';
import { Sparkles, Beef, Pizza, UtensilsCrossed, Fish, Cake } from 'lucide-react';

export interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Beef': return <Beef className="w-5 h-5" />;
      case 'Pizza': return <Pizza className="w-5 h-5" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'Fish': return <Fish className="w-5 h-5" />;
      case 'Cake': return <Cake className="w-5 h-5" />;
      default: return <UtensilsCrossed className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3.5 p-3 pr-5 rounded-2xl border transition-all duration-200 text-left w-full ${
        isSelected
          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-[1.02]'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          isSelected
            ? 'bg-white/20 text-white'
            : 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white'
        }`}
      >
        {getIcon(category.iconName)}
      </div>
      <div>
        <h4 className="font-bold text-sm font-heading leading-tight">{category.name}</h4>
        <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
          {category.itemCount} Items
        </p>
      </div>
    </button>
  );
};
