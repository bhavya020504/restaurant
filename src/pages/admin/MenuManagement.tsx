import React, { useState } from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { Plus, Edit2, Trash2, Image, Sparkles, Check, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { FoodItem } from '../../types';

export const MenuManagement: React.FC = () => {
  const { foods, categories, addFood, updateFood, deleteFood, toggleStock, addCategory, deleteCategory } = useMenuStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // New Food State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Artisan Burgers');
  const [price, setPrice] = useState('18.50');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('Beef, Cheese, Lettuce');

  // New Category State
  const [catName, setCatName] = useState('');

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || f.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    addFood({
      name,
      category,
      price: parseFloat(price) || 15.00,
      rating: 4.8,
      reviewCount: 12,
      image,
      description,
      ingredients: ingredients.split(',').map((s) => s.trim()),
      prepTimeMinutes: 15,
      calories: 650,
      inStock: true
    });
    setIsAddFoodOpen(false);
    setName('');
    setDescription('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: catName,
      iconName: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    });
    setIsAddCategoryOpen(false);
    setCatName('');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:w-80">
          <SearchBar value={search} onChange={setSearch} placeholder="Search dish name, category..." />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => setIsAddCategoryOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Category
          </Button>
          <Button size="sm" onClick={() => setIsAddFoodOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add New Food Item
          </Button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCat('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            selectedCat === 'All'
              ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          All Items ({foods.length})
        </button>

        {categories.map((cat) => (
          <div key={cat.id} className="relative group shrink-0">
            <button
              onClick={() => setSelectedCat(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCat === cat.name
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat.name}
            </button>
          </div>
        ))}
      </div>

      {/* Food Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <Table headers={['Food Item', 'Category', 'Price', 'Stock Status', 'Prep Time', 'Actions']}>
          {filteredFoods.map((food) => (
            <tr key={food.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-heading">{food.name}</h4>
                    <p className="text-xs text-slate-400 max-w-xs truncate">{food.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-bold text-orange-600 dark:text-orange-400">{food.category}</td>
              <td className="px-6 py-4 font-black text-slate-900 dark:text-white font-heading">{formatCurrency(food.price)}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStock(food.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                    food.inStock
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}
                >
                  {food.inStock ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {food.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">{food.prepTimeMinutes} mins</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteFood(food.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete Food Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* ADD FOOD MODAL */}
      <Modal isOpen={isAddFoodOpen} onClose={() => setIsAddFoodOpen(false)} title="Add New Menu Dish">
        <form onSubmit={handleCreateFood} className="space-y-4">
          <Input label="Dish Name" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input label="Price ($)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Food Image URL (Upload Placeholder)
            </label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} leftIcon={<Image className="w-4 h-4" />} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
          </div>

          <Input label="Ingredients (comma separated)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />

          <Button type="submit" className="w-full font-bold">
            Create Menu Item
          </Button>
        </form>
      </Modal>

      {/* ADD CATEGORY MODAL */}
      <Modal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} title="Add New Category">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input label="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} required />
          <Button type="submit" className="w-full font-bold">
            Create Category
          </Button>
        </form>
      </Modal>

    </div>
  );
};
