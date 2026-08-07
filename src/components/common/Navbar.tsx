import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Utensils, Calendar, User, Menu as MenuIcon, X, PhoneCall, LayoutDashboard, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const currentUser = useAuthStore((state) => state.currentUser);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservation' },
    { name: 'Order Tracking', path: '/order-tracking/BR-8921' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                BR <span className="text-orange-500">KITCHEN</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                Gourmet Dining
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  isActive(link.path)
                    ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Quick Admin Toggle */}
            <Link
              to="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Admin Dashboard Portal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
              <span>Admin Panel</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 transition-colors border border-orange-500/20"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth Button */}
            {currentUser ? (
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold rounded-xl ${
                isActive(link.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 text-orange-500" />
              <span>Admin Dashboard</span>
            </Link>
            {currentUser ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl bg-orange-500 text-white"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
