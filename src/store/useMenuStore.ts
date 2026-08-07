import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FoodItem, Category } from '../types';
import { MOCK_FOODS, MOCK_CATEGORIES } from '../constants/mockData';

interface MenuState {
  foods: FoodItem[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addFood: (food: Omit<FoodItem, 'id'>) => void;
  updateFood: (id: string, updated: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  toggleStock: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'itemCount'>) => void;
  deleteCategory: (id: string) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      foods: MOCK_FOODS,
      categories: MOCK_CATEGORIES,
      searchQuery: '',
      selectedCategory: 'All',

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      addFood: (newFood) => {
        const id = `food-${Date.now()}`;
        const item: FoodItem = { ...newFood, id };
        set((state) => ({ foods: [item, ...state.foods] }));
      },

      updateFood: (id, updated) => {
        set((state) => ({
          foods: state.foods.map((item) => (item.id === id ? { ...item, ...updated } : item))
        }));
      },

      deleteFood: (id) => {
        set((state) => ({
          foods: state.foods.filter((item) => item.id !== id)
        }));
      },

      toggleStock: (id) => {
        set((state) => ({
          foods: state.foods.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
        }));
      },

      addCategory: (cat) => {
        const id = `cat-${Date.now()}`;
        const newCat: Category = { ...cat, id, itemCount: 0 };
        set((state) => ({ categories: [...state.categories, newCat] }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }));
      }
    }),
    {
      name: 'br-kitchen-menu-storage'
    }
  )
);
