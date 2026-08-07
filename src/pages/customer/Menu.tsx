import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenuStore } from '../../store/useMenuStore';
import { FoodCard } from '../../components/customer/FoodCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { Sparkles, Leaf, Flame, Filter } from 'lucide-react';

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { foods, categories } = useMenuStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);

  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesVeg = !vegOnly || item.isVeg;
      const matchesSpicy = !spicyOnly || item.isSpicy;

      return matchesSearch && matchesCat && matchesVeg && matchesSpicy;
    });
  }, [foods, search, selectedCategory, vegOnly, spicyOnly]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Fresh Gourmet Creations
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white font-heading">
          Explore Our Menu
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Select from our handcrafted range of Wagyu burgers, woodfired pizzas, and signature chef dishes.
        </p>
      </div>

      {/* Controls Bar: Search & Quick Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by food name, ingredient..."
            />
          </div>

          {/* Veg & Spicy Toggles */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                vegOnly
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-emerald-500/30'
              }`}
            >
              <Leaf className="w-4 h-4" /> Veg Only
            </button>

            <button
              onClick={() => setSpicyOnly(!spicyOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                spicyOnly
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-rose-500/30'
              }`}
            >
              <Flame className="w-4 h-4" /> Spicy Only
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
              selectedCategory === 'All'
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-500/30'
            }`}
          >
            All Items ({foods.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-500/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <Filter className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-heading">No matching dishes found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search filter or category selection.</p>
        </div>
      )}

    </div>
  );
};
